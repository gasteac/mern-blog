import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Textarea,
  Progress,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const UpdatePost = () => {
  const navigate = useNavigate();
  const storage = getStorage();
  const { currentUser } = useSelector((state) => state.user);
  const postId = useParams().postId;
  const [postData, setPostData] = useState({});
  const [postTitle, setPostTitle] = useState(""); //TODO
  const [uploadPostSuccess, setUploadPostSuccess] = useState(false);
  const [uploadImgError, setUploadImgError] = useState(null);
  const [updatePostError, setUpdatePostError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [oldImagePost, setOldImagePost] = useState(null);

  // useEffect(() => {
  //   try {
  //     const getPostById = async () => {
  //       const res = await axios.get(`/api/post/getposts?postId=${postId}`);
  //       if (res.status !== 200) setUpdatePostError(res.data.message);
  //       if (res.status === 200) {
  //         setPostData(res.data.posts[0]);
  //         setUpdatePostError(null);

  //       }
  //     };
  //     getPostById();
  //   } catch (error) {
  //     console.log(error.response.data.message);
  //     setUpdatePostError(error.response.data.message);
  //   }
  // }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setUploadImgError(null);
    }
  };

  // const handleDeleteImage = async () => {
  //   console.log(oldImagePost)
  //   const desertRef = ref(storage, oldImagePost);
  //   try {
  //     const imgDel = await deleteObject(desertRef);
  //     setOldImagePost(null);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDeleteImage = async () => {
    const fileRef = ref(storage, oldImagePost);
    if (oldImagePost === null) {
      return;
    } else {
      // Eliminar el archivo utilizando la referencia no raíz
      await deleteObject(fileRef);
      setOldImagePost(null);
    }
  };

  // useEffect(() => {
  //   if (imageFile) {
  //     uploadImage();
  //   }
  // }, [imageFile]);

  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }, 1500);
    }
  }, [imageFileUploadProgress]);

  const uploadImage = async (title, content, category) => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
        setImageFile(null);
        setImageFileUrl(null);
        setUploadImgError("Image must be less than 2mb");
      },
      () => {
        const downloadURL = getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
            setUploadImgError(null);
            const postSaved = axios
              .put(`/api/post/updatepost/${postId}/${currentUser._id}`, {
                title,
                content,
                category,
                image: downloadURL ? downloadURL : undefined,
              })
              .then((response) => {
                if (response.status === 200) {
                  setUpdatePostError(null);
                  setUploadPostSuccess(true);
                  handleDeleteImage();
                  setTimeout(() => {
                    setUploadPostSuccess(null);
                    navigate("/dashboard?tab=posts");
                  }, 2000);

                  // setImageFileUploadProgress(null);
                  // setImageFileUploading(false);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        );
      }
    );
  };

  const formik = useFormik({
    //si no pongo lo de abajo el form se carga antes q los valores traidos de axios asique no me muestra nada
    enableReinitialize: true,
    initialValues: {
      title: postData.title ? postData.title : "",
      content: postData.content ? postData.content : "",
      category: postData.category ? postData.category : "",
      image: postData.image ? postData.image : "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(4, "Must be 4 characters or more")
        .max(30, "Must be 30 characters or less"),
      content: Yup.string()
        .min(4, "Must be 4 characters or more")
        .max(2000, "Must be 2000 characters or less"),
      category: Yup.string(),
    }),
    onSubmit: async ({ title, content, category }) => {
      if (
        title === postData.title &&
        content === postData.content &&
        category === postData.category &&
        !imageFile
      ) {
        setUpdatePostError("No changes detected :)");
        return;
      }
      setUpdatePostError(null);
      setUploadPostSuccess(false);
      try {
        if (imageFile) {
          return uploadImage(title, content, category);
        }

        const postSaved = await axios.put(
          `/api/post/updatepost/${postId}/${currentUser._id}`,
          {
            title,
            content,
            category,
          }
        );
        if (postSaved.status === 200) {
          setUpdatePostError(null);
          setUploadPostSuccess(true);
          setTimeout(() => {
            setUploadPostSuccess(null);
          }, 2000);
          setImageFile(null);
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
        }
      } catch (error) {
        const { message } = error.response.data;
        setUpdatePostError(message);
        setTimeout(() => {
          setUpdatePostError(null);
        }, 2000);
      }
    },
  });

  useEffect(() => {
    try {
      const getPostById = async () => {
        const res = await axios.get(`/api/post/getposts?postId=${postId}`);
        if (res.status !== 200) setUpdatePostError(res.data.message);
        if (res.status === 200) {
          setPostData(res.data.posts[0]);
          // setUpdatePostError(null);
          setOldImagePost(postData.image);
        }
      };
      getPostById();
      setTimeout(() => {
        setUpdatePostError(null);
      }, 3000);
    } catch (error) {
      setUpdatePostError(error.response.data.message);
    }
  }, [postId, formik.isSubmitting, oldImagePost]);

  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">
        Edit{" "}
        <span className="dark:text-blue-300 text-blue-600 ">
          {postData.title ? postData.title : "Post"}
        </span>
      </h1>
      {updatePostError && (
        <Alert
          color="failure"
          className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
        >
          {updatePostError}
        </Alert>
      )}
      {uploadPostSuccess && (
        <Alert
          color="success"
          className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
        >
          Post updated successfully!
        </Alert>
      )}
      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        {formik.touched.title && formik.errors.title ? (
          <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
            {formik.errors.title}
          </h6>
        ) : null}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            value={formik.values.title}
            type="text"
            placeholder="Title"
            className="flex-1"
            id="title"
            name="title"
            onChange={(e) => {
              formik.handleChange(e);
            }}
          />
          <Select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={(e) => {
              formik.handleChange(e);
            }}
          >
            <option value="unselected">Select Category</option>
            <option value="funny">Funny</option>
            <option value="sad">Sad</option>
            <option value="animals">Animals</option>
            <option value="people">People</option>
            <option value="TI">TI</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-2 border-teal-400 border-dashed p-3">
          <FileInput
            disabled={imageFileUploading}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
        </div>
        {imageFileUploadProgress && (
          <Progress progress={imageFileUploadProgress} />
        )}
        {uploadImgError
          ? (setTimeout(() => {
              setUploadImgError(null);
            }, 4500),
            (
              <Alert
                color="failure"
                className="font-semibold h-1 text-clip flex items-center justify-center"
              >
                {uploadImgError}
              </Alert>
            ))
          : (postData.image || imageFileUrl) && (
              <img
                src={imageFileUrl ? imageFileUrl : postData.image}
                alt="Post"
                className="w-32 h-32 object-cover rounded-lg shadow-lg"
              />
            )}
        {formik.touched.content && formik.errors.content ? (
          <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
            {formik.errors.content}
          </h6>
        ) : null}
        <Textarea
          placeholder="Write something"
          className="h-32 resize-none"
          id="content"
          name="content"
          value={formik.values.content}
          onChange={(e) => {
            formik.handleChange(e);
          }}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          size="lg"
          disabled={imageFileUploading}
        >
          Update Post
        </Button>
      </form>
    </div>
  );
};

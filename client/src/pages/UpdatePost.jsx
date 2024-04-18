import {
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

export const UpdatePost = () => {
  const postId = useParams().postId;
  const [postData, setPostData] = useState({});

  useEffect(() => {
    try {
      const getPostById = async () => {
        const res = await axios.get(`/api/post/getposts?=postId=${postId}`);
        if (res.status !== 200) setUploadPostError("Error getting post data");
        if (res.status === 200) {
          setPostData(res.data.posts[0]);
          setUploadPostError(null);
        }
      };
      getPostById();
    } catch (error) {
      console.log(error);
      setUploadPostError("Error getting post data");
    }
  }, [postId]);

  // console.log(postData)
  // useEffect(() => {
  //   if (!postData) return;
  //   if (postData) {
  //     formik.setValues({
  //       title: postData?.title,
  //       content: postData?.content,
  //       category: postData?.category,
  //       image: postData?.image,
  //     });
  //   }
  // }, [postData]);

  const [postUploadSuccess, setPostUploadSuccess] = useState(false);
  const [uploadImgError, setUploadImgError] = useState(null);
  const [uploadPostError, setUploadPostError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setUploadImgError(null);
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }, 1500);
    }
  }, [imageFileUploadProgress]);
  const uploadImage = async () => {
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
            setImageFileUrl(downloadURL);
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
            setUploadImgError(null);
          }
        );
      }
    );
  };
  const formik = useFormik({
    initialValues: {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      image: postData.image,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title of the post is required!")
        .min(4, "Must be 4 characters or more")
        .max(30, "Must be 30 characters or less"),
      content: Yup.string()
        .required("Content of the post is required!")
        .min(4, "Must be 4 characters or more")
        .max(2000, "Must be 2000 characters or less"),
      category: Yup.string(),
    }),
    onSubmit: async ({ title, content, category }) => {
      try {
        const postSaved = await axios.post("/api/post/create", {
          title,
          content,
          category,
          image: imageFileUrl ? imageFileUrl : undefined,
        });
        if (postSaved.status === 201) {
          setUploadPostError(null);
          formik.resetForm();
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
          setPostUploadSuccess(true);
          setTimeout(() => {
            setPostUploadSuccess(null);
          }, 3000);
        }
      } catch (error) {
        const { message } = error.response.data;
        setUploadPostError(message);
        setTimeout(() => {
          setUploadPostError(null);
        }, 4500);
      }
    },
  });
  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Edit POSTNAME</h1>
      {uploadPostError && (
        <Alert
          color="failure"
          className="mb-4 font-semibold h-1 text-clip flex items-center justify-center"
        >
          Error: Duplicated title
        </Alert>
      )}
      {postUploadSuccess && (
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
            value={postData.title || ""}
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
            value={postData.category || "unselected"}
            onChange={(e) => {
              formik.handleChange(e);
            }}
          >
            <option value="unselected">Select Category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React.js</option>
            <option value="react">Next.js</option>
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
              <div className="max-w-full h-32 hover:h-52 overflow-y-scroll transition-all duration-30 ease-in-out">
                <img
                  src={imageFileUrl ? imageFileUrl : postData.image}
                  alt="Post"
                  className="w-full object-cover "
                />
              </div>
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
          value={postData.content || ""}
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

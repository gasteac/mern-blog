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
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-circular-progressbar/dist/styles.css";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const CreatePost = () => {
  const navigate = useNavigate();
  const [postUploadSuccess, setPostUploadSuccess] = useState(false);
  // Estado para almacenar los errores en la actualizacion de usuario
  const [uploadImgError, setUploadImgError] = useState(null);
  // Estado para almacenar los errores en el relleno del formulario de post
  const [uploadPostError, setUploadPostError] = useState(null);
  // Estado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState(null);
  // Estado para almacenar la URL de la imagen seleccionada
  const [imageFileUrl, setImageFileUrl] = useState(null);
  // Estado para almacenar si se está subiendo una imagen
  const [imageFileUploading, setImageFileUploading] = useState(false);
  // Estado para almacenar el progreso de la carga de la imagen
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  // Estado para almacenar la URL de la imagen seleccionada
  const handleImageChange = (e) => {
    //Se sube una sola imagen asi que se selecciona la primera posición
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      // setImageFileUrl(URL.createObjectURL(file)); lo hacia de forma local
      setUploadImgError(null);
    }
  };

  // Efecto para limpiar el estado `imageFileUploadProgress` cuando la carga de la imagen llega al 100%
  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
      }, 1500);
    }
  }, [imageFileUploadProgress]);
  // Función asíncrona para cargar la imagen en el almacenamiento storage de firebase
  const uploadImage = async () => {
    console.log("hola");
    //Seteo el estado de subida de la imagen a true para que el usuario no pueda hacer nada mientras se sube
    setImageFileUploading(true);
    //Obtengo el storage de firebase, le paso la conf mediante app que exporte en el archivo firebase.js
    const storage = getStorage(app);
    //Creo un nombre para la imagen que se va a subir, en este caso la fecha en milisegundos y el nombre de la imagen
    const fileName = new Date().getTime() + imageFile.name;
    //Creo una referencia al storage de firebase con el nombre de la imagen, para poder acceder a ella, es como un indice.
    const storageRef = ref(storage, fileName);
    //Subo la imagen al storage de firebase, con la referencia y el archivo de imagen
    //uploadBytesResumable es una promesa que me devuelve un objeto con información constante de la carga de la imagen
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    //Agrego un listener
    //uploadTask es un objeto que tiene un evento llamado state_changed que se dispara cada vez que cambia el estado de la carga de la imagen
    uploadTask.on(
      //Este evento se dispara cada vez que cambia el estado de la carga de la imagen
      "state_changed",
      //snapshot es un objeto que tiene información de la carga de la imagen
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //Ahora guardo el progreso de la carga de la imagen (se guarda constantemente hasta que llega a 100%)
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        //Si hay un error al subir la imagen, lo guardo en el estado para mostrarlo en el componente
        setImageFileUploadProgress(null);
        //Reseteo el estado de subida de la imagen
        setImageFileUploading(false);
        //Reseteo el archivo de imagen y la URL de la imagen
        setImageFile(null);
        //Reseteo la URL de la imagen
        setImageFileUrl(null);
        //Guardo el error en el estado para mostrarlo en el componente
        setUploadImgError("Image must be less than 2mb");
      },
      () => {
        //Cuando la imagen se sube correctamente, obtengo la URL de descarga de la imagen de firebase
        //Le paso la referencia de la imagen que se subió
        //Es una promesa que me devuelve la URL de la imagen en firebase
        const downloadURL = getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            //Luego la guardo y la muestro en la imagen de perfil del usuario con imageFileUrl
            setImageFileUrl(downloadURL);
            //Reseteo el estado de subida de la imagen
            setImageFileUploading(false);
            setUploadImgError(null);
          }
        );
      }
    );
  };
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
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
      console.log(title, content, category);
      try {
        const postSaved = await axios.post("/api/post/create", {
          title,
          content,
          category,
          image: imageFileUrl ? imageFileUrl : null,
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
            navigate(`/post/${postSaved.data.slug}`);
          }, 3000);
        }
        console.log(postSaved.data)
      } catch (error) {
        const { message } = error.response.data;
        console.log(message);
        setUploadPostError(message);
         setTimeout(() => {
            setUploadPostError(null);
          }, 3000);
      
      }
    },
  });
  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Create a post</h1>
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
          Post created successfully!
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
            <option value="javascript">Javascript</option>
            <option value="react">React.js</option>
            <option value="react">Next.js</option>
          </Select>
        </div>
        <div className="flex items-center gap-4 justify-between border-2 border-teal-400 border-dashed p-3">
          <FileInput
            // value={postUploadSuccess ? 'Image uploaded successfully!' : 'Upload Image'}
            disabled={imageFileUploading}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
          <Button
            type="button"
            disabled={!imageFile || imageFileUploading}
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={uploadImage}
          >
            "Upload Image"
          </Button>
        </div>
        {imageFileUploadProgress && (
          <ProgressBar completed={imageFileUploadProgress} bgColor="#5d55f6" />
        )}
        {uploadImgError ? (
          <Alert
            color="failure"
            className="font-semibold h-1 text-clip flex items-center justify-center"
          >
            {uploadImgError}
          </Alert>
        ) : (
          imageFileUrl && (
            <img
              src={imageFileUrl}
              alt="Post"
              className="h-24 w-24 object-cover"
            />
          )
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
          Create Post
        </Button>
      </form>
    </div>
  );
};

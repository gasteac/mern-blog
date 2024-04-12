import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { modifyUserStart } from "../redux/user/userSlice";

//Aclaración, no confundir ref de firebase con ref de useRef de react

export const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  // Estado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState(null);
  // Estado para almacenar la URL de la imagen seleccionada
  const [imageFileUrl, setImageFileUrl] = useState(null);
  // Estado para almacenar el progreso de la carga de la imagen
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  // Estado para almacenar los errores de carga de la imagen
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  // Referencia al selector de archivos de entrada en el DOM (se usa para que al hacer clic en la imagen, en realidad se haga clic en el input de tipo file)
  const filePickerRef = useRef();
  // Función para manejar el cambio de imagen seleccionada
  const handleImageChange = (e) => {
    //Se sube una sola imagen asi que se selecciona la primera posición
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      // setImageFileUrl(URL.createObjectURL(file)); lo hacia de forma local
    }
  };

  // Efecto para limpiar el estado `imageFileUploadProgress` cuando la carga de la imagen llega al 100%
  useEffect(() => {
    if (imageFileUploadProgress == 100) {
      setTimeout(() => {
        setImageFileUploadProgress(null);
      }, 1500);
    }
  }, [imageFileUploadProgress]);

  // Efecto para iniciar la carga de la imagen cuando el estado `imageFile` cambia
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Función asíncrona para cargar la imagen en el almacenamiento storage de firebase
  const uploadImage = async () => {
    //Hago reset al error por si antes el usuario tuvo un error al subir la imagen
    setImageFileUploadError(null);
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
        //Reseteo el archivo de imagen y la URL de la imagen
        setImageFile(null);
        //Reseteo la URL de la imagen
        setImageFileUrl(null);
        //Guardo el error en el estado para mostrarlo en el componente
        setImageFileUploadError(
          "Image must be less than 2mb and have a valid format like .jpg"
        );
      },
      () => {
        //Cuando la imagen se sube correctamente, obtengo la URL de descarga de la imagen de firebase
        //Le paso la referencia de la imagen que se subió
        //Es una promesa que me devuelve la URL de la imagen en firebase
        const downloadURL = getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            //Luego la guardo y la muestro en la imagen de perfil del usuario con imageFileUrl
            setImageFileUrl(downloadURL);
          }
        );
      }
    );
  };

const formik = useFormik({
  initialValues: {
    username: currentUser.username,
    email: currentUser.email,
    password: "******",
  },
  validationSchema: Yup.object({
    username: Yup.string(),
    email: Yup.string(),
    password: Yup.string().min(6, "Must be 6 characters or more"),
  }),
  onSubmit: async ({ username, email, password }) => {
    try {
      // Cuando el usuario envía el formulario, se dispara la acción SignUpStart, que cambia el estado isLoading a true.
      dispatch(modifyUserStart());
      // Hacemos una petición POST a la ruta /api/auth/signup con los datos del formulario. (trim saca los espacios en blanco al principio y al final de un string)
      const res = await axios.post("/api/auth/update/:userId", {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      if (res.status === 201) {
        //obtengo el usuario de la respuesta, que esta en data
        // Si la petición es exitosa, se dispara la acción SignUpSuccess, que guarda el usuario en el estado global y redirige al usuario a la página principal.
        dispatch(signUpSuccess(res.data));

      }
    } catch (error) {
      const { message } = error.response.data;
      // Si el mensaje de error incluye "duplicate" y "email", mostramos un mensaje de error personalizado.
      if (message.includes("duplicate") && message.includes("email")) {
        setEmailErrorMsg("Email already in use");
      }
      // Si el mensaje de error incluye "duplicate" y "username", mostramos un mensaje de error personalizado.
      if (message.includes("duplicate") && message.includes("username")) {
        setUsernameErrorMsg("Username already in use");
      }
      // Si la petición falla, se dispara la acción SignUpFailure, que cambia el estado isLoading a false y muestra un mensaje de error al usuario.
      dispatch(signUpFailure());
    }
  },
});





  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">
        <span className="text-emerald-500">Hi </span>
        {currentUser.username}
      </h1>
      <form className="flex flex-col gap-4">
        <input
          hidden
          type="file"
          //Le asigno la referencia del input file a filePickerRef
          //Para luego hacer click en el input file cuando se haga click en la imagen
          ref={filePickerRef}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
          //Cuando se hace click en la imagen, se hace click en el input file mediante filePickerRef.current.click()
          onClick={() => filePickerRef.current.click()}
          className="relative w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full"
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress || 0}%`}
              strikeWidth={5}
              styles={{
                root: {
                  position: "absolute",
                },
                text: {
                  fill: "white",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                },
                path: {
                  stroke: `rgba(62, 231, 153, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            //Si el usuario subió una imagen la muestro, sino muestro la imagen de perfil del usuario
            src={imageFileUrl ? imageFileUrl : currentUser.profilePic}
            alt="user"
            className="rounded-full w-full h-full border-8 object-cover border-[lightgray]"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" className="font-semibold">
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          type="text"
          label="Username"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          label="Email"
          id="email"
          placeholder="email@company.com"
          defaultValue={currentUser.email}
        />{" "}
        <TextInput
          type="password"
          label="Password"
          id="password"
          placeholder="********"
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          <span>Update</span>
        </Button>
      </form>
      <div className="text-red-500 justify-between flex mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

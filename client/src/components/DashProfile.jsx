import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Label,
  Spinner,
  TextInput,
  Alert,
  Modal,
} from "flowbite-react";
import { Link } from "react-router-dom";
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
import {
  deleteUserSuccess,
  logoutSuccess,
  modifyUserFailure,
  modifyUserStart,
  modifyUserSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

//Aclaración, no confundir ref de firebase con ref de useRef de react

export const DashProfile = () => {
  const dispatch = useDispatch();
  // showModal es un estado local que nos permite mostrar un modal al usuario
  const [showModal, setShowModal] = useState(false);
  // usernameErrorMsg y emailErrorMsg son estados locales que nos permiten mostrar mensajes de error personalizados.
  const [usernameErrorMsg, setUsernameErrorMsg] = useState(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState(null);
  // isLoading es una propiedad del estado global que nos dice si la petición de registro/login está en curso.
  const { isLoading } = useSelector((state) => state.user);
  // currentUser es una propiedad del estado global que nos da acceso a los datos del usuario autenticado.
  const { currentUser } = useSelector((state) => state.user);
  // Estado para almacenar si se está subiendo una imagen
  const [imageFileUploading, setImageFileUploading] = useState(false);
  // Estado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState(null);
  // Estado para almacenar la URL de la imagen seleccionada
  const [imageFileUrl, setImageFileUrl] = useState(null);
  // Estado para almacenar el progreso de la carga de la imagen
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  // Estado para almacenar los errores en la actualizacion de usuario
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
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
        setImageFileUploading(false);
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
    //Reseteo el estado de éxito de la actualización del usuario
    setUpdateUserSuccess(null);
    //Hago reset al error por si antes el usuario tuvo un error
    setUpdateUserError(null);
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
        setUpdateUserError(
          "Image must be less than 2mb and have a valid format like .jpg"
        );
        setUpdateUserSuccess(null);
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
          }
        );
      }
    );
  };


  const formik = useFormik({
    initialValues: {
      username: currentUser.username,
      email: currentUser.email,
      password: "",
      profilePic: currentUser.profilePic,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Required!")
        .min(4, "Must be 4 characters or more")
        .max(14, "Must be 14 characters or less"),
      email: Yup.string().required("Required!"),
      password: Yup.string().min(6, "Must be 6 characters or more"),
    }),
    onSubmit: async ({ username, email, password }) => {
      //Si se está subiendo una imagen, no dejo que el usuario envíe el formulario
      if (imageFileUploading) {
        setUpdateUserError("Please wait for image to upload");
        return;
      }
      if (
        username === currentUser.username &&
        email === currentUser.email &&
        !imageFileUrl &&
        password === ""
      ) {
        setUpdateUserError("No changes detected :)");
        return;
      }
      setUpdateUserError(null);
      setUpdateUserSuccess(false);
      try {
        // Cuando el usuario envía el formulario, se dispara la acción SignUpStart, que cambia el estado isLoading a true.
        dispatch(modifyUserStart());
        // Hacemos una petición POST a la ruta /api/auth/signup con los datos del formulario. (trim saca los espacios en blanco al principio y al final de un string)
        const res = await axios.put(`/api/user/update/${currentUser._id}`, {
          ...currentUser,
          username: username,
          email: email,
          password: password,
          profilePic: imageFileUrl ? imageFileUrl : currentUser.profilePic,
        });
        setImageFileUrl(null);
        if (res.status === 200) {
          //obtengo el usuario de la respuesta, que esta en data
          // Si la petición es exitosa, se dispara la acción SignUpSuccess, que guarda el usuario en el estado global y redirige al usuario a la página principal.
          dispatch(modifyUserSuccess(res.data));
          setUpdateUserSuccess("User updated successfully!");
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
        dispatch(modifyUserFailure());
        setUpdateUserSuccess(false);
       
        // Si el mensaje de error incluye "duplicate" y "email", mostramos un mensaje de error personalizado.
        // if (message.includes("duplicate") && message.includes("email")) {
        //   setEmailErrorMsg("Email already in use");
        // }
        // // Si el mensaje de error incluye "duplicate" y "username", mostramos un mensaje de error personalizado.
        // if (message.includes("duplicate") && message.includes("username")) {
        //   setUsernameErrorMsg("Username already in use, is this your username?");
        // }
        // // Si la petición falla, se dispara la acción SignUpFailure, que cambia el estado isLoading a false y muestra un mensaje de error al usuario.
        // dispatch(modifyUserFailure());
      }
    },
  });

  const deleteUser = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      dispatch(deleteUserSuccess());
      localStorage.removeItem("persist:root");
    } catch (error) {
      setUpdateUserError("Error deleting user");
    }
  };

  const handleSignOut = () => {
    try {
      axios.post("/api/user/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto h-full w-full pb-6">
      <form
        className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:p-6 "
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col items-center justify-center sm:self-start h-full">
          <h1 className="my-7 text-center font-semibold text-3xl text-nowrap capitalize">
            <span className="hiText">Hi </span>
            {currentUser.username}
          </h1>
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
            className="relative w-36 h-36 self-center cursor-pointer shadow-lg overflow-hidden rounded-full"
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
              className="rounded-full w-full h-full border-8 object-cover border-[lightgray] "
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 w-full h-full sm:max-w-[30rem]">
          {(updateUserError || updateUserSuccess) && (
            <Alert
              color={updateUserError ? "failure" : "success"}
              className="font-semibold"
            >
              {updateUserError ? updateUserError : updateUserSuccess}
            </Alert>
          )}
          <div className="group">
            <Label value="Username" className="groupLabel"></Label>
            <TextInput
              type="text"
              placeholder="username"
              id="username"
              name="username"
              onChange={(e) => {
                formik.handleChange(e);
                setUsernameErrorMsg(null);
              }}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {formik.errors.username}
              </h6>
            ) : null}
            {usernameErrorMsg ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {usernameErrorMsg}
              </h6>
            ) : null}
          </div>

          <div className="group">
            <Label value="Email" className="groupLabel"></Label>
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              name="email"
              onChange={(e) => {
                formik.handleChange(e), setEmailErrorMsg(null);
              }}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {formik.errors.email}
              </h6>
            ) : null}
            {emailErrorMsg ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {emailErrorMsg}
              </h6>
            ) : null}
          </div>

          <div className="group">
            <Label value="Password" className="groupLabel"></Label>
            <TextInput
              type="password"
              placeholder="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {formik.errors.password}
              </h6>
            ) : null}
          </div>
          <Button
            className="mt-3"
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={isLoading || imageFileUploading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-3">Loading..</span>
              </>
            ) : (
              <span>Save!</span>
            )}
          </Button>
          {currentUser.isAdmin && (
            <Link to='/create-post'>
            <Button
              className="mt-3 w-full"
              type="button"
            
              gradientDuoTone="purpleToPink"
              disabled={isLoading || imageFileUploading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-3">Loading..</span>
                </>
              ) : (
                <span>Create a post</span>
              )}
            </Button>
            </Link>
            
          )}
          <div className="justify-between flex flex-col items-center gap-4 mt-5">
            <span
              className="cursor-pointer font-semibold hiText"
              onClick={() => setShowModal(true)}
            >
              Delete Account
            </span>
            <span
              onClick={handleSignOut}
              className="cursor-pointer font-semibold hover:text-gray-400"
            >
              Sign Out
            </span>
          </div>
        </div>
      </form>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body className="flex items-center justify-center flex-col gap-5">
          <HiOutlineExclamationCircle className="text-red-500 text-6xl" />
          <h1 className="text-center text-2xl font-semibold">
            Are you sure? :(
          </h1>
          <div className="flex justify-between gap-5">
            <Button onClick={deleteUser} color="failure">
              yes, delete it
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              gradientDuoTone="greenToBlue"
            >
              cancel!
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

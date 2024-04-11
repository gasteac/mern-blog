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
import { set } from "mongoose";

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
  // Efecto para iniciar la carga de la imagen cuando el estado `imageFile` cambia
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

useEffect(() => {
  if (imageFileUploadProgress == 100) {
    setTimeout(() => {
      setImageFileUploadProgress(null);
    }, 1500);
  }
}, [imageFileUploadProgress]);

  // Función asíncrona para cargar la imagen en el almacenamiento storage de firebase
  const uploadImage = async () => {
    //Hago reset al error por si antes el usuario tuvo un error al subir la imagen
    setImageFileUploadError(null);
    //Obtengo el storage de la app que exporte en el archivo firebase.js, osea de toda mi conf del proyecto en firestone, de ahi obtengo el storage, que previamente lo active en firebase
    const storage = getStorage(app);
    //Creo un nombre para la imagen que se va a subir, en este caso la fecha en milisegundos y el nombre de la imagen
    const fileName = new Date().getTime() + imageFile.name;
    //Creo una referencia al storage de firebase con el nombre de la imagen, para poder acceder a ella, es como un indice.
    const storageRef = ref(storage, fileName);
    //Subo la imagen al storage de firebase, con la referencia y el archivo de imagen
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    //Agrego un listener para saber el progreso de la carga de la imagen
    //Para luego mostrar la progressBar de la imagen
    uploadTask.on(
      //Este evento se dispara cada vez que cambia el estado de la carga de la imagen
      "state_changed",
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
        //Es una promesa que me devuelve la URL de descarga de la imagen
        const downloadURL = getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            //Guardo la URL de descarga de la imagen
            //Para luego mostrarla en la imagen de perfil del usuario con imageFileUrl
            setImageFileUrl(downloadURL);
          }
        );
      }
    );
  };
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
          ref={filePickerRef}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
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

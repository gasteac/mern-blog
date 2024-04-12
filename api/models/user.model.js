import mongoose from "mongoose";

// Schema es una clase de mongoose que nos permite definir la estructura de los datos que vamos a guardar en la bdd
const userSchema = new mongoose.Schema(
  //aca le paso los campos que va a tener el usuario
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/mern-blog-cd6ab.appspot.com/o/1712914011331userImage.png?alt=media&token=3b018c64-d4c7-4e79-9f4d-626867c77429",
    },
  },
  { timestamps: true } //quiero que cuando se crea o modifique quede guardado la fecha y hora
);

// User es un modelo de mongoose que nos permite interactuar con la colección de usuarios en la bdd
// Le pasamos el nombre de la colección y el schema que definimos arriba (y esto se guarda en la bdd)
const User = mongoose.model("User", userSchema);

//exporto el modelo User. que incluye los métodos de mongoose para interactuar con la bdd 
//como por ejemplo find, findOne, findById, save, update, delete, etc
export default User;

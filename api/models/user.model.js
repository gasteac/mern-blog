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
        "https://w7.pngwing.com/pngs/304/275/png-transparent-user-profile-computer-icons-profile-miscellaneous-logo-monochrome.png",
    },
    isAdmin: {
      type: Boolean,
      default: true,
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

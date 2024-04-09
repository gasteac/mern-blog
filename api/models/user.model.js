import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  //aca le paso los campos que va a tener el usuario, como username, email y password}
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
  },
  { timestamps: true } //quiero que cuando se crea o modifique quede guardado
);

const User = mongoose.model("User", userSchema);

export default User;

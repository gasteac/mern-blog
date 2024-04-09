import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  { timestamps: true }, //quiero que cuando se crea o modifique quede guardado
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
  }
);

const User = mongoose.model('User', userSchema)

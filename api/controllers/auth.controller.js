import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  //esto es seguridad extra ya que en el modelo de user ya tenemos que sean obligatorios
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    //aca manejo el error con mi manejador de errores personalizado
    next(errorHandler(400, 'All fields are required'))
  }
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPass,
  });
  try {
    await newUser.save();
    res.status(201).json({
      newUser,
    });
  
  } catch (error) {
    //que maneje los errores en el middleware que esta en index.js
    //no utilizo mi manejador de errores porque no se que error mandarle como msj
    next(error)
  }
};

export default signup;

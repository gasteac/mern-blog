import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { jwtCookie } from "../utils/jwtCookie.js";

///los next son para manejar los errores dsp
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
    next(errorHandler(400, "All fields are required"));
  }
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPass,
  });
  try {
    await newUser.save();
    //utilizamos jwt para dejar su sesión iniciada
    const token = jwtCookie(newUser);
    res
      .status(201)
      //y agregamos la cookie al navegador
      .cookie("access_token", token, {
        //para las cookies necesitamos agregar httpOlny true para que sea mas seguro
        //si la api y el cliente estan en el mismo server podemos agregar despues de httpOnly: true, " sameSite:'strict' "
        httpOnly: true,
      })
      .json({ newUser });
  } catch (error) {
    //que maneje los errores en el middleware que esta en index.js
    //no utilizo mi manejador de errores porque no se que error mandarle como msj
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    //Pregunto si existe algun usuario con ese email con el metodo de mongoose findOne
    //utiliza el modelo en este caso User para entregarle ese email e ir a buscar a la bdd a ver si existe
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Invalid Email or Password"));
    }
    //verificamos si la contraseña es correcta
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid Email or Password"));
    }
    //aca ya verificamos que el usuario ingreso correctamente
    //utilizamos jwt para dejar su sesión iniciada
    const token = jwtCookie(validUser);
    //no quiero que la res me devuelva la contraseña también
    //separo la contraseña del resto, guardo solo el resto
    //_doc es el formato original en que esta guardado en mongoDB, es un documento de mongo
    const { password: pass, ...rest } = validUser._doc;
    //si haces un console log ambos devuelven lo mismo, pero si arriba usamos solo validUser no funciona
    // console.log(validUser._doc);
    // console.log(validUser)
    //guardamos en la cookies como access_token a "token" definido previamente
    res
      .status(200)
      .cookie("access_token", token, {
        //para las cookies necesitamos agregar httpOlny true para que sea mas seguro
        //si la api y el cliente estan en el mismo server podemos agregar despues de httpOnly: true, " sameSite:'strict' "
        httpOnly: true,
      })
      //devolvemos un json con el objeto del usuario creado
      .json({ rest });
  } catch (error) {
    console.log('error')
    //el next busca el siguiente middleware en la cola de middlewares, y como le mandamos un error
    //busca el middleware q esta en index.js nomas y lo trata ahi
    next(error);
  }
};

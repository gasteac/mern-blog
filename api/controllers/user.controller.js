
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
//función de prueba para verificar que la api funciona correctamente
export const test = (req, res) => {
  res.status(200).json({
    message: "it works",
  });
};

//función para actualizar los datos del usuario
//el "user" que le llega aca, es el que decodificamos del token en el middleware verifyToken
//por lo que tiene el id del usuario que hizo la petición (si es que esta autorizado)
export const updateUser = async (req, res, next) => {
  //verifico que el id del usuario que hizo la petición sea el mismo que el id del usuario que quiere actualizar
  //req.params.userId es el id que se pasa en la url "http://localhost:3000/api/user/update/6617823d4a6fca588b043c34" ese ultimo código
  //req.user.id es el id del usuario que esta en el token

  //pregunto por req.USER porque nos fijamos en las cookies no en la petición http en si, es verifyToken el q nos devuelve user
  if (req.params.userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  const { username, email, profilePic } = req.body;
  //verifico que los datos que se quieren actualizar sean correctos
  //si el password tiene menos de 6 caracteres, devuelvo un error
  // if (req.body.password.length < 6) {
  //   return next(errorHandler(400, "Password must be at least 6 characters"));
  // }
  // //si el username tiene menos de 7 caracteres o mas de 20, devuelvo un error
  // if (req.body.username.length < 7 || req.body.username.length > 20) {
  //   return next(
  //     errorHandler(400, "Username must be between 7 and 20 characters")
  //   );
  // }
  // //si el email tiene menos de 7 caracteres o mas de 50, devuelvo un error
  // if (req.body.email.length < 7 || req.body.email.length > 50) {
  //   return next(errorHandler(400, "Email must be between 7 and 50 characters"));
  // }
  // //si el email no tiene un @ o un punto, devuelvo un error
  // if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
  //   return next(errorHandler(400, "Invalid email"));
  // }
  // //si el username tiene espacios, devuelvo un error
  // if (req.body.username.includes(" ")) {
  //   return next(errorHandler(400, "Username cannot contain spaces"));
  // }
  // //si el username no es todo en minúsculas, devuelvo un error
  // if (req.body.username !== req.body.username.toLowerCase()) {
  //   return next(errorHandler(400, "Username must be lowercase"));
  // }
  // //si el username no tiene solo letras y números, devuelvo un error
  // if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
  //   return next(
  //     errorHandler(400, "Username must contain only letters and numbers")
  //   );
  // }
  //encripto la nueva contraseña antes de guardarla en la base de datos
  const hashedPassword = (req.body.password = bcryptjs.hashSync(
    req.body.password,
    10
  ));
  try {
    //busco al usuario por el id que se pasa en la url (o podría haber utilizado req.user.id da igual)
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        //si lo encuentra, actualiza los datos del usuario
        //$set es un método de mongoose para actualizar los datos del usuario
        $set: { username, hashedPassword, email, profilePic },
      },
      //con {new: true} le digo a mongoose que me devuelva el usuario actualizado
      { new: true }
    );
    //devuelvo el usuario actualizado sin la contraseña
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).clearCookie("access_token").json("User has been deleted");
  } catch (error) {
    next(error);
  }
}

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Logged out");
  } catch (error) {
    next(error);
  }
}
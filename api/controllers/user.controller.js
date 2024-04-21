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
  
  if (req.body.profilePic !== '' && !req.body.password && !req.body.username && !req.body.email) {
    console.log('no')
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        //si lo encuentra, actualiza los datos del usuario
        //$set es un método de mongoose para actualizar los datos del usuario
        $set: { profilePic: req.body.profilePic },
      },
      //con {new: true} le digo a mongoose que me devuelva el usuario actualizado
      { new: true }
    );
   const { password, ...rest } = updatedUser._doc;

   res.status(200).json(rest);
  } else {
    const { username, email, profilePic } = req.body;
    //encripto la nueva contraseña antes de guardarla en la base de datos
    const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    try {
      //busco al usuario por el id que se pasa en la url (o podría haber utilizado req.user.id da igual)
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          //si lo encuentra, actualiza los datos del usuario
          //$set es un método de mongoose para actualizar los datos del usuario
          $set: { username, password: hashedPassword, email, profilePic },
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
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Logged out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const sortDirection = req.query.sort == "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonth,
    });
  } catch (error) {
    next(errorHandler(500, "Internal server error"));
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

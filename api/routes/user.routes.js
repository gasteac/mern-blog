import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signOut,
  getUsers,
  deleteUserAdmin,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();
//test solo para probar el funcionamiento de la api al inicio del proyecto.
router.get("/test", test);
//ruta para actualizar el usuario, se pasa el id del usuario a actualizar, luego con el 
//middleware verifyToken se verifica que el usuario esta autorizado a editar esos datos 
//y se llama a la función updateUser

//aclaración: este userId es el que se compara con el id de usuario que devuelve el token en verifyToken
//lo vas a ver en el controlador updateUser al principio de la función
router.put("/update/:userId", verifyToken, updateUser);

router.delete("/delete/:userId", verifyToken, deleteUser);

router.delete("/deleteuser/:userId", verifyToken, deleteUserAdmin);

router.post("/logout", signOut);

router.get("/getusers", verifyToken, getUsers);

//lo exporto como "router" pero en el index.js donde lo llamo le doy el nombre que quiero, en estos casos userRoute o authRoute
export default router;

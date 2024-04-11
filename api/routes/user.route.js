import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
//ruta para actualizar el usuario, se pasa el id del usuario a actualizar y el token de verificación y se llama a la función updateUser
router.put("/update/:userId", verifyToken, updateUser);
//lo exporto como router pero en el index donde lo llamo le doy el nombre que quiero
//en este caso userRoute
export default router;

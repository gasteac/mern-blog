import express from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";
const router = express.Router();

//le digo que si es un post en esa direccion aplique el controlador de signup
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
//lo exporto como router pero en el index donde lo llamo le doy el nombre que quiero
//en este caso authRoute
export default router;

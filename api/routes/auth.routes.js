import express from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";

//creo un router con express, basicamente le digo, "si es un post en esa direccion, usa el controlador de signup"
const router = express.Router();

//le digo que si es un post en esa direccion "/api/auth/signup" aplique el controlador de signup
router.post("/signup", signup);
//le digo que si es un post en esa direccion "/api/auth/signin" aplique el controlador de signin
router.post("/signin", signin);
//le digo que si es un post en esa direccion "/api/auth/google" aplique el controlador de google
router.post("/google", google);
//lo exporto como "router" pero en el index.js donde lo llamo le doy el nombre que quiero, en estos casos userRoute o authRoute
export default router;

import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
//lo exporto como router pero en el index donde lo llamo le doy el nombre que quiero
//en este caso userRoute
export default router;

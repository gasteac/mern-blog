import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config(); //esto va a setear las variables del .env en process.env osea en el entorno

//nos conectamos a la bdd de mongodb mediante mongoose pasándole la url de la bdd que esta en .env
mongoose
  .connect(process.env.MONGO)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//Creamos una instancia de express que va a ser nuestro server y la guardamos con el nombre app
const app = express();

//middleware que permite parsear JSON del backend a lenguaje usable (string) y manipulable
app.use(express.json());
//middleware que permite parsear cookies
app.use(cookieParser());

///////////RUTAS///////////

//se pone api para que se pueda redireccionar a la url de la api mediante un proxy en la conf del server en el frontend (vite.config.js)

//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use("/api/user", userRoute);
//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use("/api/auth", authRoute);

//Le decimos al server que escuche en el puerto 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//Este es el middleware de último recurso para manejar errores generales. (aca llegan todos los errores, ya sean de la bdd, de la api, de la app, de mi errorHandler, etc)
//El parámetro error que llega aca es el que se creo con el errorHandler (error.jsx) al que yo le había pasado un mensaje y un código de error
//o de algún error proveniente de la bdd o de firebase mediante next(error) en el catch de los controladores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error MW";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

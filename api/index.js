import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

dotenv.config(); //this will load the .env file and set the environment variables
mongoose
  .connect(process.env.MONGO)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();

//middleware que permite parsear JSON del backend a lenguaje usable (string) y manipulable
app.use(express.json());

//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use("/api/user", userRoute);

//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use("/api/auth", authRoute);

//Middleware que maneja errores, dsp de que se realiza algo en user o auth, viene aca con los next, porque al usar
//use toma a auth y a user también como middlewares
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

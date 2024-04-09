import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
import authRoute from "./routes/auth.route.js";

dotenv.config(); //this will load the .env file and set the environment variables
mongoose
  .connect(
    process.env.MONGO
  )
  .then(console.log("Connected to MongoDB")).catch(err => console.log(err));

const app = express();

//middleware que permite parsear JSON del backend a lenguaje usable (string) y manipulable
app.use(express.json())


//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use('/api/user', userRoute)

//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use('/api/auth', authRoute)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

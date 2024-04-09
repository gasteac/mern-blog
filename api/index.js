import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
dotenv.config(); //this will load the .env file and set the environment variables
mongoose
  .connect(
    process.env.MONGO
  )
  .then(console.log("Connected to MongoDB")).catch(err => console.log(err));

const app = express();

//aca le paso las rutas para user como "USE" porque los get push delete y eso ya están en userRoute
app.use('/api/user', userRoute)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

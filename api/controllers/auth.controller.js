import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
export const signup = async(req, res) => {
  const {username, email, password} = req.body
  
  try {
    //esto es seguridad extra ya que en el modelo de user ya tenemos que sean obligatorios
    if (!username || !email ||  !password || username === '' || email === '' || password === ''){
        return res.status(400).json({message:'All fields are required'})
    }
    const hashedPass = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password : hashedPass
    })
    try {
         await newUser.save();
     res.status(201).json({
       newUser
     });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
   
  } catch (error) {
    res.status(400).json({
        message:'Error'
    })
  }
};

export default signup

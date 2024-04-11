import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.status(200).json({
    message: "it works",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(errorHandler(401, "Unauthorized"));
  }
  if (req.body.password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }
  req.body.password = bcryptjs.hashSync(req.body.password, 10);
  if (req.body.username.length < 7 || req.body.username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 7 and 20 characters")
    );
  }
  if (req.body.email.length < 7 || req.body.email.length > 50) {
    return next(errorHandler(400, "Email must be between 7 and 50 characters"));
  }
  if (!req.body.email.includes('@') || !req.body.email.includes('.')){
    return next(errorHandler(400, "Invalid email"));
  }
  if (req.body.username.includes(' ')){
    return next(errorHandler(400, "Username cannot contain spaces"));
  }
  if (req.body.username !== req.body.username.toLowerCase()){
    return next(errorHandler(400, "Username must be lowercase"));
  }
  if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
    return next(errorHandler(400, "Username must contain only letters and numbers"));
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePic: req.body.profilePic,
      },
    }, {new: true});
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error)
  }
};

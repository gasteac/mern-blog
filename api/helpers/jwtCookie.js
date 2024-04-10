import jwt from "jsonwebtoken";
export const jwtCookie = (user) => {
  const token = jwt.sign(
    //_id es el id que le da mongoDB y es único obvio
    { id: { user }._id },
    //le entregamos la clave secreta o semilla para que mezcle, y le decimos q expira en 2 horas
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  )
  return token;
};

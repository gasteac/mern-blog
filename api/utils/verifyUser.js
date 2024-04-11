import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {
  //obtengo de la request del front el token
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  //si existe el token, lo verifico con jwt.verify
  //verify recibe el token y la clave secreta y lo decodifica
  //basicamente verifica si ell token le pertenece al usuario que lo envió
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    //como no hay error, obtengo el usuario que estaba en el token
    //guardo el usuario en req.user, osea se lo envió al frontend para que lo use
    req.user = user;
    //paso a la siguiente tarea o middleware, en este caso, updateUser u otro.
    //como ya verifique que el token es correcto, puedo seguir con la tarea que me pidieron
    //en este caso, actualizar el usuario
    next();
  });
};
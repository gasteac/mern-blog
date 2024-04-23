import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (req.user.id !== userId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes = comment.likes.filter((id) => id !== req.user.id);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const look4comment = await Comment.findById(req.params.commentId);
    if (req.user.id !== look4comment.userId && !req.user.isAdmin) {
      return next(errorHandler(401, "Unauthorized"));
    }
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};


export const getComments = async (req, res, next) => {
   try {
     //parseInt convierte el string en un número
     //startIndex es un numero que indica desde que post se empieza a buscar
     //cuando recién buscamos este es 0, pero como establecimos el limite en 9, la segunda vez que busquemos, va a ignorar los primeros 9 (porque ya se estan mostrando en la pagina) y va a empezar a buscar desde el 10
     const startIndex = parseInt(req.query.startIndex) || 0;
     //limit es la cantidad de posts que se van a buscar (por eso startIndex es importante, porque si no se establece, siempre se va a buscar desde el principio y se van a mostrar los mismos posts una y otra vez)
     const limit = parseInt(req.query.limit) || 8;
     //sortDirection es un número que indica si los posts se van a mostrar en orden ascendente o descendente
     const sortDirection = req.query.order === "asc" ? 1 : -1;
     // if (req.params.length < 1 || req.body.length < 1 || req.query.length <1) return;
     const comments = await Comment.find({
       //... es un spread operator, si el campo no esta vacio (haciendo la comprobación en el paréntesis) lo agrega al objeto
       //entonces los tres puntos "obtienen" los campos del objeto que no estan vacíos y los agrega al objeto para la consulta
       ...(req.query.userId && { userId: req.query.userId }),
       //el método sort ordena los posts por la fecha de actualización, el valor de sortDirection indica si se ordena de forma ascendente o descendente
       //el método skip saltea los primeros startIndex posts (para mostrar los siguientes posts de los que ya se están mostrando)
       //el método limit limita la cantidad de posts que se muestran
     })
       .sort({ updatedAt: sortDirection })
       .skip(startIndex)
       .limit(limit);
     //el método countDocuments cuenta la cantidad de posts que se encontraron
     const totalComments = await Comment.countDocuments();
     const now = new Date();
     //creamos una fecha que sea un mes antes de la fecha actual
     const oneMonthAgo = new Date(
       now.getFullYear(),
       now.getMonth() - 1,
       now.getDate()
     );
     //contamos la cantidad de posts que se crearon en el último mes
     const lastMonth = await Comment.countDocuments({
       createdAt: { $gte: oneMonthAgo },
     });

     res.status(200).json({
       //devolvemos los posts, la cantidad total de posts y la cantidad de posts creados en el último mes
       comments,
       totalComments,
       lastMonth,
     });
   } catch (error) {
     next(error);
   }
}
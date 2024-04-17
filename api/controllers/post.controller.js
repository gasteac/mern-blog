import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  //pregunto por req.USER porque nos fijamos en las cookies no en la petición http en si, es verifyToken el q nos devuelve user
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "All fields are required"));
  }
  //slug es el título del post en minúsculas, sin espacios y sin caracteres especiales
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  //creamos un nuevo post con los datos que vienen en el body de la petición, el slug que creamos y el id del usuario que esta creando el post
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    //parseInt convierte el string en un número
    //startIndex es un numero que indica desde que post se empieza a buscar
    //cuando recién buscamos este es 0, pero como establecimos el limite en 9, la segunda vez que busquemos, va a ignorar los primeros 9 (porque ya se estan mostrando en la pagina) y va a empezar a buscar desde el 10
    const startIndex = parseInt(req.query.startIndex) || 0;
    //limit es la cantidad de posts que se van a buscar (por eso startIndex es importante, porque si no se establece, siempre se va a buscar desde el principio y se van a mostrar los mismos posts una y otra vez)
    const limit = parseInt(req.query.limit) || 9;
    //sortDirection es un número que indica si los posts se van a mostrar en orden ascendente o descendente
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      //... es un spread operator, si el campo no esta vacio (haciendo la comprobación en el paréntesis) lo agrega al objeto
      //no podemos hacerlo solamente preguntando si req.query.userId existe porque si existe pero esta vacio, lo va a agregar como undefined
      //entonces los tres puntos "obtienen" los campos del objeto que no estan vacíos y los agrega al objeto para la consulta
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      //si searchTerm existe, se busca en el título y en el contenido
      ...(req.query.searchTerm && {
        //$or es un operador de mongoose que busca en varios campos
        //el operador $regex busca el string que le pasamos en el campo que le pasamos
        $or: [
          //el operador $options: 'i' hace que la búsqueda no sea case sensitive
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
      //el método sort ordena los posts por la fecha de actualización, el valor de sortDirection indica si se ordena de forma ascendente o descendente
      //el método skip saltea los primeros startIndex posts (para mostrar los siguientes posts de los que ya se están mostrando)
      //el método limit limita la cantidad de posts que se muestran
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    //el método countDocuments cuenta la cantidad de posts que se encontraron
    const totalPost = await Post.countDocuments();
    const now = new Date();
    //creamos una fecha que sea un mes antes de la fecha actual
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    //contamos la cantidad de posts que se crearon en el último mes
    const lastMonth = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      //devolvemos los posts, la cantidad total de posts y la cantidad de posts creados en el último mes
      posts,
      totalPost,
      lastMonth,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  // console.log(req.params);
  // console.log(req);
  if (req.params.userId !== req.user.id && !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    const del = await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    next(error);
    console.log('hola')
  }
};

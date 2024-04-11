
//este middleware se encarga de manejar los errores
//básicamente lo que haces es crear un error con un status code y un mensaje que le pasas como argumento

//si yo desde algun lugar llamo a este código, este al retornar error, el error va al manejador de error de index.js
//por lo que es el ultimo middleware de la cadena

export const errorHandler = (statusCode, message) =>{
    //creo un nuevo error y le asigno el status code y el mensaje que le paso como argumento
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error
}
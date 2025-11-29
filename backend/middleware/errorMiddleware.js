// backend/middleware/errorMiddleware.js

const notFound = (req, res, next) => {
  const error = new Error(`No Encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pasa el error al siguiente middleware (errorHandler)
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Si es un error de Mongoose de CastError (ID incorrecto)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Recurso no encontrado";
  }

  // <<<<<<<<<<<<<<<<<<<< CORRECCIÓN IMPORTANTE AQUÍ >>>>>>>>>>>>>>>>>>>>>>
  // Si los headers ya fueron enviados, no intentar enviar otra respuesta
  if (res.headersSent) {
    console.error(
      "Error handler: Headers already sent, cannot send error response again."
    );
    return next(err);
  }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Envía la respuesta de error
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Stacktrace solo en desarrollo
  });
};

export { notFound, errorHandler };

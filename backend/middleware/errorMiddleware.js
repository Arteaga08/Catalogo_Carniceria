// backend/middleware/errorMiddleware.js

// Middleware para manejar rutas no encontradas (404)
const notFound = (req, res, next) => {
  const error = new Error(`No Encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pasa el error al siguiente middleware (errorHandler)
};

// Middleware general para manejar errores
const errorHandler = (err, req, res, next) => {
  // A veces el status code ya viene definido (ej. 401, 403, 404), si no, usa 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // En desarrollo, enviamos la pila del error para depurar. En producción, la ocultamos.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };

const { errorResponse } = require("../utils/response.utils");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado:", err);
  console.error("Stack trace:", err.stack);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Error interno del servidor";
  let errors = null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Error de validación";
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "ID inválido proporcionado";
    errors = [
      {
        field: err.path,
        message: `El valor "${err.value}" no es un ${err.kind} válido`,
      },
    ];
  } else if (err.code === 11000) {
    statusCode = 400;
    message = "Valor duplicado";

    const field = Object.keys(err.keyPattern)[0];
    errors = [
      {
        field: field,
        message: `El ${field} ya está en uso`,
      },
    ];
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expirado";
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "JSON inválido en el cuerpo de la petición";
  }

  const response = {
    success: false,
    message: message,
    errors: errors,
    stack: err.stack,
    errorName: err.name,
  };

  return res.status(statusCode).json(response);
};

const notFoundHandler = (req, res) => {
  return errorResponse(res, 404, "Endpoint no encontrado", null);
};

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  createError,
  asyncHandler,
};

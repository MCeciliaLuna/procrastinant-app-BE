exports.successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message: message,
    data: data,
  };

  return res.status(statusCode).json(response);
};

exports.errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message: message,
    errors: errors,
  };

  if (process.env.NODE_ENV === "development" && errors && errors.stack) {
    response.stack = errors.stack;
  }

  return res.status(statusCode).json(response);
};

exports.validationErrorResponse = (res, errors) => {
  return exports.errorResponse(
    res,
    400,
    "Error en validación de datos",
    errors
  );
};

exports.unauthorizedResponse = (res, message = "No autorizado") => {
  return exports.errorResponse(res, 401, message, null);
};

exports.forbiddenResponse = (res, message = "Acceso prohibido") => {
  return exports.errorResponse(res, 403, message, null);
};

exports.notFoundResponse = (res, message = "Recurso no encontrado") => {
  return exports.errorResponse(res, 404, message, null);
};

exports.serverErrorResponse = (
  res,
  message = "Error interno del servidor",
  error = null
) => {
  if (error && process.env.NODE_ENV === "development") {
    console.error("Server Error:", error);
  }

  return exports.errorResponse(res, 500, message, null);
};

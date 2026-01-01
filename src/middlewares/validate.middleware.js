const { validationResult } = require("express-validator");
const { validationErrorResponse } = require("../utils/response.utils");

const validarResultados = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((error) => ({
    field: error.path || error.param,
    message: error.msg,
    value: error.value,
  }));
  return validationErrorResponse(res, formattedErrors);
};

module.exports = {
  validarResultados,
};

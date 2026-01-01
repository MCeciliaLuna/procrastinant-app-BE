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

const createCustomValidator = (validatorFn) => {
  return (value, { req }) => {
    return validatorFn(value, req);
  };
};

const sanitizeString = (value, options = {}) => {
  const {
    trim = true,
    removeSpecialChars = false,
    toLowerCase = false,
    toUpperCase = false,
  } = options;

  let sanitized = value;

  if (trim) {
    sanitized = sanitized.trim();
  }

  if (removeSpecialChars) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  if (toLowerCase) {
    sanitized = sanitized.toLowerCase();
  }

  if (toUpperCase) {
    sanitized = sanitized.toUpperCase();
  }

  return sanitized;
};

module.exports = {
  validarResultados,
  createCustomValidator,
  sanitizeString,
};

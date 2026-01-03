const { body, param } = require("express-validator");
const { validarResultados } = require("../middlewares/validate.middleware");

exports.validarCrearTarea = [
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isLength({ min: 1, max: 300 })
    .withMessage("La descripción debe tener entre 1 y 300 caracteres"),

  body("listo")
    .optional()
    .isBoolean()
    .withMessage("El campo listo debe ser un valor booleano (true/false)"),

  validarResultados,
];

exports.validarActualizarTarea = [
  param("id")
    .notEmpty()
    .withMessage("El ID de la tarea es requerido")
    .isMongoId()
    .withMessage("El ID proporcionado no es un ID de MongoDB válido"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isLength({ min: 1, max: 300 })
    .withMessage("La descripción debe tener entre 1 y 300 caracteres"),

  body("listo")
    .not()
    .exists()
    .withMessage(
      'No se puede actualizar el campo "listo" aquí. Usa el endpoint PATCH /tareas/:id/toggle'
    ),

  body("userId")
    .not()
    .exists()
    .withMessage("No se puede cambiar el usuario propietario de una tarea"),

  validarResultados,
];

exports.validarToggleTarea = [
  param("id")
    .notEmpty()
    .withMessage("El ID de la tarea es requerido")
    .isMongoId()
    .withMessage("El ID proporcionado no es un ID de MongoDB válido"),

  body("listo")
    .optional()
    .isBoolean()
    .withMessage("El campo listo debe ser un valor booleano (true/false)"),

  validarResultados,
];

exports.validarEliminarTarea = [
  param("id")
    .notEmpty()
    .withMessage("El ID de la tarea es requerido")
    .isMongoId()
    .withMessage("El ID proporcionado no es un ID de MongoDB válido"),

  validarResultados,
];

exports.validarReordenarTareas = [
  body("orden")
    .notEmpty()
    .withMessage("El array de orden es requerido")
    .isArray({ min: 1 })
    .withMessage("El orden debe ser un array con al menos un elemento"),

  body("orden.*.tareaId")
    .notEmpty()
    .withMessage("El tareaId es requerido en cada elemento")
    .isMongoId()
    .withMessage("El tareaId debe ser un ID de MongoDB válido"),

  body("orden.*.numeroOrden")
    .notEmpty()
    .withMessage("El numeroOrden es requerido en cada elemento")
    .isInt({ min: 0 })
    .withMessage("El numeroOrden debe ser un entero mayor o igual a 0"),

  validarResultados,
];

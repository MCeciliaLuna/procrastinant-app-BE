const { body } = require("express-validator");
const { validarResultados } = require("../middlewares/validate.middleware");

exports.validarActualizarPerfil = [
  body("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("apellido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras y espacios"),

  body("alias")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El alias no puede estar vacío")
    .isLength({ min: 3, max: 10 })
    .withMessage("El alias debe tener entre 3 y 10 caracteres")
    .isAlphanumeric("es-ES")
    .withMessage("El alias solo puede contener letras y números"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("El email no puede exceder 255 caracteres"),

  body("password")
    .not()
    .exists()
    .withMessage(
      "No se puede cambiar la contraseña aquí. Usa el endpoint PUT /user/password"
    ),

  validarResultados,
];

exports.validarCambiarPassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),

  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La nueva contraseña debe contener al menos una mayúscula y un número"
    )
    .isLength({ max: 128 })
    .withMessage("La nueva contraseña no puede exceder 128 caracteres")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error(
          "La nueva contraseña debe ser diferente a la contraseña actual"
        );
      }
      return true;
    }),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
  validarResultados,
];

exports.validarEliminarCuenta = [
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida para confirmar la eliminación"),

  body("confirmacion")
    .custom((value) => {
      if (value !== "ELIMINAR") {
        throw new Error(
          "Para confirmar la eliminación, debes escribir exactamente: ELIMINAR"
        );
      }
      return true;
    }),

  validarResultados,
];

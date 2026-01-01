const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const {
  validarActualizarPerfil,
  validarCambiarPassword,
  validarEliminarCuenta,
} = require("../validators/user.validator");

const { verificarAuth } = require("../middlewares/auth.middleware");

router.use(verificarAuth);

router.get("/profile", userController.obtenerPerfil);

router.get("/verify", userController.verificarAuth);

router.put(
  "/profile",
  validarActualizarPerfil,
  userController.actualizarPerfil
);

router.put("/password", validarCambiarPassword, userController.cambiarPassword);

router.delete("/account", validarEliminarCuenta, userController.eliminarCuenta);

module.exports = router;

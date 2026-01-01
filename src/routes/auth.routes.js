const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
  validarRegistro,
  validarLogin,
} = require("../validators/auth.validator");

const { verificarAuth } = require("../middlewares/auth.middleware");

router.post("/register", validarRegistro, authController.register);

router.post("/login", validarLogin, authController.login);

router.post("/logout", verificarAuth, authController.logout);

module.exports = router;

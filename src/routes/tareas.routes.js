const express = require("express");
const router = express.Router();

const tareasController = require("../controllers/tareas.controller");

const {
  validarCrearTarea,
  validarActualizarTarea,
  validarToggleTarea,
  validarEliminarTarea,
} = require("../validators/tarea.validator");

const { verificarAuth } = require("../middlewares/auth.middleware");

router.use(verificarAuth);

router.get("/", tareasController.obtenerTareas);

router.post("/", validarCrearTarea, tareasController.crearTarea);

router.put("/:id", validarActualizarTarea, tareasController.actualizarTarea);

router.patch("/:id/toggle", validarToggleTarea, tareasController.toggleTarea);

router.delete("/:id", validarEliminarTarea, tareasController.eliminarTarea);

module.exports = router;

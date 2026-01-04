const Tarea = require("../models/Tarea.model");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
} = require("../utils/response.utils");

exports.obtenerTareas = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { listo, sort = "createdAt", order = "desc" } = req.query;

    const options = {
      listo: listo !== undefined ? listo === "true" : null,
      sort: sort,
      order: order,
    };
    const tareas = await Tarea.findByUserId(userId, options);

    return successResponse(res, 200, "Tareas obtenidas exitosamente", {
      tareas: tareas,
      total: tareas.length,
    });
  } catch (error) {
    next(error);
  }
};

exports.crearTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { descripcion, listo = false } = req.body;

    const nuevaTarea = new Tarea({
      userId: userId,
      descripcion: descripcion,
      listo: listo,
    });
    await nuevaTarea.save();

    return successResponse(res, 201, "Tarea creada exitosamente", {
      tarea: nuevaTarea.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.actualizarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;
    const { descripcion } = req.body;

    const tarea = await Tarea.findById(tareaId);
    if (!tarea) {
      return notFoundResponse(res, "Tarea no encontrada");
    }

    if (tarea.userId.toString() !== userId) {
      return forbiddenResponse(
        res,
        "No tienes permisos para modificar esta tarea"
      );
    }

    if (descripcion !== undefined) {
      tarea.descripcion = descripcion;
    }
    await tarea.save();

    return successResponse(res, 200, "Tarea actualizada exitosamente", {
      tarea: tarea.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;
    const { listo } = req.body;

    const tarea = await Tarea.findById(tareaId);
    if (!tarea) {
      return notFoundResponse(res, "Tarea no encontrada");
    }

    if (tarea.userId.toString() !== userId) {
      return forbiddenResponse(
        res,
        "No tienes permisos para modificar esta tarea"
      );
    }

    if (listo !== undefined) {
      tarea.listo = listo;
      await tarea.save();
    } else {
      await tarea.toggle();
    }

    return successResponse(res, 200, "Estado de tarea actualizado", {
      tarea: tarea.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.eliminarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;

    const tarea = await Tarea.findById(tareaId);
    if (!tarea) {
      return notFoundResponse(res, "Tarea no encontrada");
    }

    if (tarea.userId.toString() !== userId) {
      return forbiddenResponse(
        res,
        "No tienes permisos para eliminar esta tarea"
      );
    }

    await Tarea.findByIdAndDelete(tareaId);

    return successResponse(res, 200, "Tarea eliminada exitosamente", {
      tareaId: tareaId,
    });
  } catch (error) {
    next(error);
  }
};

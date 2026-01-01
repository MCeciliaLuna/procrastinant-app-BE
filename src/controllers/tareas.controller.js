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

    const { listo, sort = "numeroOrden", order = "asc" } = req.query;

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
    const { descripcion, listo = false, numeroOrden } = req.body;

    const nuevaTarea = new Tarea({
      userId: userId,
      descripcion: descripcion,
      listo: listo,
      numeroOrden: numeroOrden,
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
    const { descripcion, numeroOrden } = req.body;

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
    if (numeroOrden !== undefined) {
      tarea.numeroOrden = numeroOrden;
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

exports.reordenarTareas = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orden } = req.body;

    const tareasIds = orden.map((item) => item.tareaId);
    const tareas = await Tarea.find({
      _id: { $in: tareasIds },
      userId: userId,
    });

    if (tareas.length !== orden.length) {
      return errorResponse(
        res,
        400,
        "Algunas tareas no existen o no te pertenecen"
      );
    }

    const updatePromises = orden.map((item) =>
      Tarea.findByIdAndUpdate(
        item.tareaId,
        { numeroOrden: item.numeroOrden },
        { new: true }
      )
    );
    const tareasActualizadas = await Promise.all(updatePromises);

    return successResponse(res, 200, "Tareas reordenadas exitosamente", {
      tareasActualizadas: tareasActualizadas.length,
      tareas: tareasActualizadas.map((t) => ({
        _id: t._id,
        numeroOrden: t.numeroOrden,
        descripcion: t.descripcion,
      })),
    });
  } catch (error) {
    next(error);
  }
};

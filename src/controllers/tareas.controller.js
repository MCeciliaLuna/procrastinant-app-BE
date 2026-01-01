/**
 * Controlador de Tareas
 *
 * Este controlador maneja todos los endpoints relacionados con las tareas:
 * - Obtener todas las tareas del usuario
 * - Crear nueva tarea
 * - Actualizar tarea
 * - Toggle estado (listo/no listo)
 * - Eliminar tarea
 * - Reordenar tareas
 */

const Tarea = require("../models/Tarea.model");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
} = require("../utils/response.utils");

/**
 * Obtener todas las tareas del usuario autenticado
 * GET /api/tareas
 * Acceso: Privado
 *
 * Query params opcionales:
 * - page: número de página (default: 1)
 * - limit: tareas por página (default: 50)
 * - listo: filtrar por estado (true/false)
 * - sort: campo para ordenar (createdAt, numeroOrden, descripcion)
 * - order: dirección del ordenamiento (asc, desc)
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.obtenerTareas = async (req, res, next) => {
  try {
    // El userId viene del middleware de autenticación
    const userId = req.userId;

    // Extraer parámetros de query
    const {
      listo,
      sort = "numeroOrden",
      order = "asc",
    } = req.query;

    // TODO: Obtener tareas del usuario con los filtros y ordenamiento especificados
    // const options = {
    //   listo: listo !== undefined ? listo === 'true' : null,
    //   sort: sort,
    //   order: order,
    // };
    // const tareas = await Tarea.findByUserId(userId, options);

    // TODO: Obtener count total para paginación
    // const filters = listo !== undefined ? { listo: listo === 'true' } : {};
    // const totalTareas = await Tarea.countByUserId(userId, filters);

    // TODO: Devolver respuesta con tareas
    // return successResponse(res, 200, 'Tareas obtenidas exitosamente', {
    //   tareas: tareas
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de obtener tareas - Implementar query a MongoDB",
      {
        userId: userId,
        filters: { listo, sort, order },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva tarea
 * POST /api/tareas
 * Acceso: Privado
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.crearTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { descripcion, listo = false, numeroOrden } = req.body;

    // TODO: Crear nueva tarea en la base de datos
    // const nuevaTarea = new Tarea({
    //   userId: userId,
    //   descripcion: descripcion,
    //   listo: listo,
    //   numeroOrden: numeroOrden
    // });
    // await nuevaTarea.save();

    // TODO: Devolver respuesta con la tarea creada
    // return successResponse(res, 201, 'Tarea creada exitosamente', {
    //   tarea: nuevaTarea.toJSON()
    // });

    // Placeholder response
    return successResponse(
      res,
      201,
      "Endpoint de crear tarea - Implementar creación en MongoDB",
      {
        received: { descripcion, listo, numeroOrden, userId },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar tarea
 * PUT /api/tareas/:id
 * Acceso: Privado
 *
 * Solo se pueden actualizar: descripcion, numeroOrden
 * El campo 'listo' se actualiza con el endpoint toggle
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.actualizarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;
    const { descripcion, numeroOrden } = req.body;

    // TODO: Buscar la tarea por ID
    // const tarea = await Tarea.findById(tareaId);
    // if (!tarea) {
    //   return notFoundResponse(res, 'Tarea no encontrada');
    // }

    // TODO: Verificar que la tarea pertenece al usuario autenticado
    // if (tarea.userId.toString() !== userId) {
    //   return forbiddenResponse(res, 'No tienes permisos para modificar esta tarea');
    // }

    // TODO: Actualizar solo los campos proporcionados
    // if (descripcion !== undefined) {
    //   tarea.descripcion = descripcion;
    // }
    // if (numeroOrden !== undefined) {
    //   tarea.numeroOrden = numeroOrden;
    // }
    // await tarea.save();

    // TODO: Devolver respuesta con la tarea actualizada
    // return successResponse(res, 200, 'Tarea actualizada exitosamente', {
    //   tarea: tarea.toJSON()
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de actualizar tarea - Implementar actualización en MongoDB",
      {
        tareaId: tareaId,
        userId: userId,
        updates: { descripcion, numeroOrden },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle estado de tarea (listo/no listo)
 * PATCH /api/tareas/:id/toggle
 * Acceso: Privado
 *
 * Si se envía 'listo' en el body, se establece ese valor.
 * Si no se envía, se hace toggle del valor actual.
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.toggleTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;
    const { listo } = req.body;

    // TODO: Buscar la tarea por ID
    // const tarea = await Tarea.findById(tareaId);
    // if (!tarea) {
    //   return notFoundResponse(res, 'Tarea no encontrada');
    // }

    // TODO: Verificar pertenencia
    // if (tarea.userId.toString() !== userId) {
    //   return forbiddenResponse(res, 'No tienes permisos para modificar esta tarea');
    // }

    // TODO: Actualizar estado
    // if (listo !== undefined) {
    //   // Si se proporciona un valor específico, usarlo
    //   tarea.listo = listo;
    // } else {
    //   // Si no, hacer toggle
    //   tarea.listo = !tarea.listo;
    // }
    // await tarea.save();

    // TODO: Devolver respuesta
    // return successResponse(res, 200, 'Estado de tarea actualizado', {
    //   tarea: tarea.toJSON()
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de toggle tarea - Implementar cambio de estado en MongoDB",
      {
        tareaId: tareaId,
        userId: userId,
        newState: listo,
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar tarea
 * DELETE /api/tareas/:id
 * Acceso: Privado
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.eliminarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const tareaId = req.params.id;

    // TODO: Buscar la tarea por ID
    // const tarea = await Tarea.findById(tareaId);
    // if (!tarea) {
    //   return notFoundResponse(res, 'Tarea no encontrada');
    // }

    // TODO: Verificar pertenencia
    // if (tarea.userId.toString() !== userId) {
    //   return forbiddenResponse(res, 'No tienes permisos para eliminar esta tarea');
    // }

    // TODO: Eliminar la tarea
    // await Tarea.findByIdAndDelete(tareaId);

    // TODO: Devolver respuesta
    // return successResponse(res, 200, 'Tarea eliminada exitosamente', {
    //   tareaId: tareaId
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de eliminar tarea - Implementar eliminación en MongoDB",
      {
        tareaId: tareaId,
        userId: userId,
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reordenar tareas
 * POST /api/tareas/reorder
 * Acceso: Privado
 *
 * Recibe un array de objetos con tareaId y numeroOrden
 * y actualiza el numeroOrden de múltiples tareas en una sola operación.
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.reordenarTareas = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orden } = req.body; // Array de { tareaId, numeroOrden }

    // TODO: Verificar que todas las tareas pertenecen al usuario
    // const tareasIds = orden.map(item => item.tareaId);
    // const tareas = await Tarea.find({ _id: { $in: tareasIds }, userId: userId });
    //
    // if (tareas.length !== orden.length) {
    //   return errorResponse(res, 400, 'Algunas tareas no existen o no te pertenecen');
    // }

    // TODO: Actualizar el numeroOrden de cada tarea
    // const updatePromises = orden.map(item =>
    //   Tarea.findByIdAndUpdate(
    //     item.tareaId,
    //     { numeroOrden: item.numeroOrden },
    //     { new: true }
    //   )
    // );
    // const tareasActualizadas = await Promise.all(updatePromises);

    // TODO: Devolver respuesta con las tareas actualizadas
    // return successResponse(res, 200, 'Tareas reordenadas exitosamente', {
    //   tareasActualizadas: tareasActualizadas.length,
    //   tareas: tareasActualizadas.map(t => ({
    //     _id: t._id,
    //     numeroOrden: t.numeroOrden,
    //     descripcion: t.descripcion
    //   }))
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de reordenar tareas - Implementar actualización en MongoDB",
      {
        userId: userId,
        orden: orden,
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

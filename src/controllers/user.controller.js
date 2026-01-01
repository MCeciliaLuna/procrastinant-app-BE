const User = require("../models/User.model");
const Tarea = require("../models/Tarea.model");
const bcrypt = require("bcrypt");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} = require("../utils/response.utils");

/**
 * Obtener perfil del usuario autenticado
 * GET /api/user/profile
 * Acceso: Privado
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.obtenerPerfil = async (req, res, next) => {
  try {
    const userId = req.userId;

    // TODO: Buscar usuario por ID (sin incluir password)
    // const user = await User.findById(userId);
    // if (!user) {
    //   return notFoundResponse(res, 'Usuario no encontrado');
    // }

    // TODO: Devolver respuesta con el perfil
    // return successResponse(res, 200, 'Perfil obtenido exitosamente', {
    //   user: user.toJSON()
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de obtener perfil - Implementar búsqueda en MongoDB",
      {
        userId: userId,
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verificar autenticación (health check de auth)
 * GET /api/user/verify
 * Acceso: Privado
 *
 * Este endpoint verifica si el token JWT es válido y el usuario existe.
 * Útil para que el frontend verifique la sesión sin hacer una petición completa.
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.verificarAuth = async (req, res, next) => {
  try {
    const userId = req.userId;

    // TODO: Opcionalmente, verificar que el usuario existe en la BD
    // const user = await User.findById(userId);
    // if (!user) {
    //   return unauthorizedResponse(res, 'Usuario no encontrado');
    // }

    // TODO: Devolver respuesta con usuario básico
    // return successResponse(res, 200, 'Usuario autenticado', {
    //   isAuthenticated: true,
    //   user: {
    //     _id: user._id,
    //     nombre: user.nombre,
    //     apellido: user.apellido,
    //     alias: user.alias,
    //     email: user.email
    //   }
    // });

    // Placeholder response (si el middleware de auth pasó, el usuario está autenticado)
    return successResponse(res, 200, "Usuario autenticado", {
      isAuthenticated: true,
      userId: userId,
      note: "Los TODOs en el controlador indican la lógica a implementar",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar perfil del usuario
 * PUT /api/user/profile
 * Acceso: Privado
 *
 * Campos actualizables: nombre, apellido, alias, email
 * Todos son opcionales, solo se actualizan los que se envían
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.actualizarPerfil = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { nombre, apellido, alias, email } = req.body;

    // TODO: Buscar usuario
    // const user = await User.findById(userId);
    // if (!user) {
    //   return notFoundResponse(res, 'Usuario no encontrado');
    // }

    // TODO: Si se está actualizando el email, verificar que no esté en uso
    // if (email && email !== user.email) {
    //   const existingUser = await User.findByEmail(email);
    //   if (existingUser) {
    //     return errorResponse(res, 400, 'El email ya está en uso', [
    //       { field: 'email', message: 'Este email ya está registrado' }
    //     ]);
    //   }
    // }

    // TODO: Actualizar solo los campos proporcionados
    // if (nombre !== undefined) user.nombre = nombre;
    // if (apellido !== undefined) user.apellido = apellido;
    // if (alias !== undefined) user.alias = alias;
    // if (email !== undefined) user.email = email;
    //
    // await user.save();

    // TODO: Devolver respuesta con el perfil actualizado
    // return successResponse(res, 200, 'Perfil actualizado exitosamente', {
    //   user: user.toJSON()
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de actualizar perfil - Implementar actualización en MongoDB",
      {
        userId: userId,
        updates: { nombre, apellido, alias, email },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Cambiar contraseña
 * PUT /api/user/password
 * Acceso: Privado
 *
 * Requiere la contraseña actual para confirmar la identidad del usuario
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.cambiarPassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // TODO: Buscar usuario (incluyendo el campo password)
    // const user = await User.findById(userId).select('+password');
    // if (!user) {
    //   return notFoundResponse(res, 'Usuario no encontrado');
    // }

    // TODO: Verificar que la contraseña actual es correcta
    // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    // if (!isPasswordValid) {
    //   return errorResponse(res, 401, 'Contraseña actual incorrecta', [
    //     { field: 'currentPassword', message: 'La contraseña actual no es correcta' }
    //   ]);
    // }

    // TODO: Hashear la nueva contraseña
    // const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    // const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // TODO: Actualizar contraseña
    // user.password = hashedPassword;
    // await user.save();

    // TODO: Devolver respuesta
    // return successResponse(res, 200, 'Contraseña actualizada exitosamente', null);

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de cambiar contraseña - Implementar verificación y actualización",
      {
        userId: userId,
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar cuenta del usuario
 * DELETE /api/user/account
 * Acceso: Privado
 *
 * ATENCIÓN: Esta es una eliminación FÍSICA (no soft delete).
 * Elimina el usuario y TODAS sus tareas asociadas.
 * Esta operación es IRREVERSIBLE.
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.eliminarCuenta = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    // TODO: Buscar usuario (incluyendo password)
    // const user = await User.findById(userId).select('+password');
    // if (!user) {
    //   return notFoundResponse(res, 'Usuario no encontrado');
    // }

    // TODO: Verificar contraseña como confirmación de seguridad
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return errorResponse(res, 401, 'Contraseña incorrecta', [
    //     { field: 'password', message: 'La contraseña no es correcta' }
    //   ]);
    // }

    // TODO: Eliminar todas las tareas del usuario
    // const tareasEliminadas = await Tarea.deleteAllByUserId(userId);

    // TODO: Eliminar el usuario
    // await User.findByIdAndDelete(userId);

    // TODO: Devolver respuesta con información de la eliminación
    // return successResponse(res, 200, 'Cuenta eliminada exitosamente', {
    //   userId: userId,
    //   tareasEliminadas: tareasEliminadas.deletedCount
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de eliminar cuenta - Implementar eliminación en MongoDB",
      {
        userId: userId,
        warning: "Esta operación eliminará el usuario y todas sus tareas",
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

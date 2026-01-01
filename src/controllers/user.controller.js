const User = require("../models/User.model");
const Tarea = require("../models/Tarea.model");
const bcrypt = require("bcrypt");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} = require("../utils/response.utils");

exports.obtenerPerfil = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return notFoundResponse(res, "Usuario no encontrado");
    }

    // Devolver respuesta con el perfil
    return successResponse(res, 200, "Perfil obtenido exitosamente", {
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.verificarAuth = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return unauthorizedResponse(res, "Usuario no encontrado");
    }

    return successResponse(res, 200, "Usuario autenticado", {
      isAuthenticated: true,
      user: {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        alias: user.alias,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.actualizarPerfil = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { nombre, apellido, alias, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return notFoundResponse(res, "Usuario no encontrado");
    }

    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return errorResponse(res, 400, "El email ya está en uso", [
          { field: "email", message: "Este email ya está registrado" },
        ]);
      }
    }

    if (nombre !== undefined) user.nombre = nombre;
    if (apellido !== undefined) user.apellido = apellido;
    if (alias !== undefined) user.alias = alias;
    if (email !== undefined) user.email = email;

    await user.save();

    return successResponse(res, 200, "Perfil actualizado exitosamente", {
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.cambiarPassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return notFoundResponse(res, "Usuario no encontrado");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Contraseña actual incorrecta", [
        {
          field: "currentPassword",
          message: "La contraseña actual no es correcta",
        },
      ]);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return successResponse(
      res,
      200,
      "Contraseña actualizada exitosamente",
      null
    );
  } catch (error) {
    next(error);
  }
};

exports.eliminarCuenta = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return notFoundResponse(res, "Usuario no encontrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Contraseña incorrecta", [
        { field: "password", message: "La contraseña no es correcta" },
      ]);
    }

    const tareasEliminadas = await Tarea.deleteAllByUserId(userId);

    await User.findByIdAndDelete(userId);

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      sameSite: "strict",
      path: "/",
    });

    return successResponse(res, 200, "Cuenta eliminada exitosamente", {
      userId: userId,
      tareasEliminadas: tareasEliminadas.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

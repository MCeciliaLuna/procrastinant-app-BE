/**
 * Controlador de Autenticación
 *
 * Este controlador maneja los endpoints relacionados con autenticación:
 * - Registro de usuarios
 * - Inicio de sesión
 * - Cierre de sesión
 */

const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt.utils");
const { successResponse, errorResponse } = require("../utils/response.utils");

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 * Acceso: Público
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.register = async (req, res, next) => {
  try {
    // Extraer datos del body (ya validados por el middleware de validación)
    const { nombre, apellido, alias, email, password } = req.body;

    // TODO: Verificar que el email no esté ya registrado
    // const existingUser = await User.findByEmail(email);
    // if (existingUser) {
    //   return errorResponse(res, 400, 'El email ya está registrado', [
    //     { field: 'email', message: 'Este email ya está en uso' }
    //   ]);
    // }

    // TODO: Hashear la contraseña con bcrypt
    // const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // TODO: Crear el nuevo usuario en la base de datos
    // const newUser = new User({
    //   nombre,
    //   apellido,
    //   alias,
    //   email,
    //   password: hashedPassword
    // });
    // await newUser.save();

    // TODO: Generar token JWT
    // const token = generateToken(newUser._id);

    // TODO: Devolver respuesta con usuario (sin password) y token
    // const userResponse = newUser.toJSON(); // toJSON ya excluye el password
    // return successResponse(res, 201, 'Usuario registrado exitosamente', {
    //   user: userResponse,
    //   token: token
    // });

    // Placeholder response (respuesta temporal mientras se implementa la lógica)
    return successResponse(
      res,
      201,
      "Endpoint de registro - Implementar lógica de creación de usuario",
      {
        received: { nombre, apellido, alias, email },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    // Pasar el error al middleware de manejo de errores
    next(error);
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 * Acceso: Público
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.login = async (req, res, next) => {
  try {
    // Extraer datos del body (ya validados)
    const { email, password } = req.body;

    // TODO: Buscar usuario por email (incluyendo el campo password)
    // const user = await User.findByEmail(email).select('+password');
    // if (!user) {
    //   return errorResponse(res, 401, 'Credenciales inválidas', [
    //     { field: 'email', message: 'Email o contraseña incorrectos' }
    //   ]);
    // }

    // TODO: Verificar contraseña con bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return errorResponse(res, 401, 'Credenciales inválidas', [
    //     { field: 'password', message: 'Email o contraseña incorrectos' }
    //   ]);
    // }

    // TODO: Generar token JWT
    // const token = generateToken(user._id);

    // TODO: Devolver respuesta con usuario (sin password) y token
    // const userResponse = user.toJSON();
    // return successResponse(res, 200, 'Inicio de sesión exitoso', {
    //   user: userResponse,
    //   token: token
    // });

    // Placeholder response
    return successResponse(
      res,
      200,
      "Endpoint de login - Implementar lógica de autenticación",
      {
        received: { email },
        note: "Los TODOs en el controlador indican la lógica a implementar",
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Cerrar sesión
 * POST /api/auth/logout
 * Acceso: Privado (requiere autenticación)
 *
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para pasar al siguiente middleware
 */
exports.logout = async (req, res, next) => {
  try {
    // El logout se maneja principalmente en el frontend eliminando el token
    // del localStorage. Si se implementa una blacklist de tokens (usando Redis),
    // se puede agregar el token actual a la blacklist aquí.

    // TODO (Opcional): Implementar blacklist de tokens con Redis
    // const token = req.headers.authorization.substring(7);
    // await blacklistToken(token);

    // Respuesta de logout exitoso
    return successResponse(res, 200, "Sesión cerrada exitosamente", null);
  } catch (error) {
    next(error);
  }
};

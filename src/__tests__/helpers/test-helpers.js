const User = require("../../models/User.model");
const Tarea = require("../../models/Tarea.model");
const { generateToken } = require("../../utils/jwt.utils");
const bcrypt = require("bcrypt");

/**
 * Crea un usuario de prueba en la base de datos
 * @param {Object} userData - Datos del usuario (opcional)
 * @returns {Promise<Object>} Usuario creado con password hasheado
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    nombre: "Test",
    apellido: "User",
    alias: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

/**
 * Crea múltiples usuarios de prueba
 * @param {number} count - Cantidad de usuarios a crear
 * @returns {Promise<Array>} Array de usuarios creados
 */
const createTestUsers = async (count = 3) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createTestUser({
      nombre: `Test${i}`,
      alias: `testuser${i}`,
      email: `test${i}@example.com`,
    });
    users.push(user);
  }
  return users;
};

/**
 * Genera un token JWT para un usuario de prueba
 * @param {string} userId - ID del usuario
 * @returns {string} Token JWT
 */
const generateTestToken = (userId) => {
  return generateToken(userId);
};

/**
 * Crea un usuario y devuelve usuario + token
 * @param {Object} userData - Datos del usuario (opcional)
 * @returns {Promise<Object>} { user, token }
 */
const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user._id.toString());
  return { user, token };
};

/**
 * Crea una tarea de prueba
 * @param {string} userId - ID del usuario propietario
 * @param {Object} tareaData - Datos de la tarea (opcional)
 * @returns {Promise<Object>} Tarea creada
 */
const createTestTarea = async (userId, tareaData = {}) => {
  const defaultTarea = {
    descripcion: "Test tarea",
    listo: false,
  };

  const tarea = new Tarea({
    userId,
    ...defaultTarea,
    ...tareaData,
  });

  await tarea.save();
  return tarea;
};

/**
 * Crea múltiples tareas de prueba para un usuario
 * @param {string} userId - ID del usuario
 * @param {number} count - Cantidad de tareas
 * @returns {Promise<Array>} Array de tareas creadas
 */
const createTestTareas = async (userId, count = 3) => {
  const tareas = [];
  for (let i = 0; i < count; i++) {
    const tarea = await createTestTarea(userId, {
      descripcion: `Tarea ${i + 1}`,
      listo: i % 2 === 0, // Alternar entre listo/no listo
    });
    tareas.push(tarea);
  }
  return tareas;
};

/**
 * Limpia todas las colecciones de la base de datos
 * Útil para usar en afterEach
 */
const cleanDatabase = async () => {
  const collections = require("mongoose").connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Mock de request para tests unitarios
 * @param {Object} options - Opciones del request
 * @returns {Object} Request mock
 */
const mockRequest = (options = {}) => {
  return {
    body: options.body || {},
    params: options.params || {},
    query: options.query || {},
    headers: options.headers || {},
    user: options.user || null,
    ...options,
  };
};

/**
 * Mock de response para tests unitarios
 * @returns {Object} Response mock con funciones spy
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock de next middleware function
 * @returns {Function} Next function spy
 */
const mockNext = () => jest.fn();

/**
 * Valida la estructura de respuesta estándar de la API
 * @param {Object} response - Respuesta a validar
 * @param {boolean} success - Si debe ser exitosa o no
 */
const validateApiResponse = (response, success = true) => {
  expect(response).toHaveProperty("success", success);
  expect(response).toHaveProperty("message");
  expect(typeof response.message).toBe("string");

  if (success) {
    expect(response).toHaveProperty("data");
  } else {
    // Puede tener errors o no
    if (response.errors) {
      expect(Array.isArray(response.errors)).toBe(true);
    }
  }
};

/**
 * Hashea una contraseña para tests
 * @param {string} password - Contraseña a hashear
 * @returns {Promise<string>} Contraseña hasheada
 */
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Datos de usuario válidos para tests
 */
const validUserData = {
  nombre: "María",
  apellido: "González",
  alias: "mariag",
  email: "maria@example.com",
  password: "Password123",
};

/**
 * Datos de tarea válidos para tests
 */
const validTareaData = {
  descripcion: "Terminar el proyecto",
  listo: false,
};

/**
 * Crea un string de cookie con el token de autenticación
 * para usar en tests de integración
 * @param {string} token - Token JWT
 * @returns {string} Cookie string para usar en supertest
 */
const createAuthCookie = (token) => {
  return `authToken=${token}`;
};

module.exports = {
  createTestUser,
  createTestUsers,
  generateTestToken,
  createAuthenticatedUser,
  createTestTarea,
  createTestTareas,
  cleanDatabase,
  mockRequest,
  mockResponse,
  mockNext,
  validateApiResponse,
  hashPassword,
  validUserData,
  validTareaData,
  createAuthCookie,
};

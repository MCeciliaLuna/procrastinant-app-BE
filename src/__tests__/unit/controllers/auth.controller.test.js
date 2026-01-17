const authController = require("../../../controllers/auth.controller");
const User = require("../../../models/User.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../../utils/jwt.utils");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../helpers/test-helpers");

// Mocks
jest.mock("../../../models/User.model");
jest.mock("bcrypt");
jest.mock("../../../utils/jwt.utils");

describe("Auth Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("debería registrar un nuevo usuario exitosamente", async () => {
      // Arrange
      req.body = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "Password123",
      };

      User.findByEmail = jest.fn().mockResolvedValue(null);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword123");

      const mockUser = {
        _id: "user123",
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: "user123",
          nombre: "Juan",
          apellido: "Pérez",
          alias: "juanp",
          email: "juan@example.com",
        }),
      };

      User.mockImplementation(() => mockUser);
      generateToken.mockReturnValue("fake-jwt-token");

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("juan@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("Password123", 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        "authToken",
        "fake-jwt-token",
        expect.objectContaining({
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
      );
    });

    it("debería rechazar email duplicado", async () => {
      // Arrange
      req.body = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "Password123",
      };

      User.findByEmail = jest
        .fn()
        .mockResolvedValue({ email: "juan@example.com" });

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("registrado"),
        })
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.body = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "Password123",
      };

      const error = new Error("Database error");
      User.findByEmail = jest.fn().mockRejectedValue(error);

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("debería hacer login con credenciales correctas", async () => {
      // Arrange
      req.body = {
        email: "juan@example.com",
        password: "Password123",
      };

      const mockUser = {
        _id: "user123",
        email: "juan@example.com",
        password: "hashedPassword123",
        toJSON: jest.fn().mockReturnValue({
          _id: "user123",
          email: "juan@example.com",
        }),
      };

      User.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      generateToken.mockReturnValue("fake-jwt-token");

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("juan@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Password123",
        "hashedPassword123"
      );
      expect(generateToken).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        "authToken",
        "fake-jwt-token",
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalled();
    });

    it("debería rechazar email inexistente", async () => {
      // Arrange
      req.body = {
        email: "noexiste@example.com",
        password: "Password123",
      };

      User.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Credenciales"),
        })
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("debería rechazar contraseña incorrecta", async () => {
      // Arrange
      req.body = {
        email: "juan@example.com",
        password: "WrongPassword",
      };

      const mockUser = {
        _id: "user123",
        email: "juan@example.com",
        password: "hashedPassword123",
      };

      User.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
      expect(generateToken).not.toHaveBeenCalled();
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.body = {
        email: "juan@example.com",
        password: "Password123",
      };

      const error = new Error("Database error");
      User.findByEmail = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    it("debería limpiar la cookie de autenticación", async () => {
      // Act
      await authController.logout(req, res, next);

      // Assert
      expect(res.clearCookie).toHaveBeenCalledWith(
        "authToken",
        expect.objectContaining({
          httpOnly: true,
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("Sesión cerrada"),
        })
      );
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      const error = new Error("Logout error");
      res.clearCookie = jest.fn().mockImplementation(() => {
        throw error;
      });

      // Act
      await authController.logout(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

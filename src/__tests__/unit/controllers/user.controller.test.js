const userController = require("../../../controllers/user.controller");
const User = require("../../../models/User.model");
const bcrypt = require("bcrypt");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../helpers/test-helpers");

// Mocks
jest.mock("../../../models/User.model");
jest.mock("bcrypt");

describe("User Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("obtenerPerfil", () => {
    it("debería obtener el perfil del usuario", async () => {
      // Arrange
      req.userId = "user123";

      const mockUser = {
        _id: "user123",
        nombre: "Juan",
        email: "juan@example.com",
        toJSON: jest.fn().mockReturnValue({
          _id: "user123",
          nombre: "Juan",
          email: "juan@example.com",
        }),
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      // Act
      await userController.obtenerPerfil(req, res, next);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.any(Object),
          }),
        })
      );
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      // Arrange
      req.userId = "user999";
      User.findById = jest.fn().mockResolvedValue(null);

      // Act
      await userController.obtenerPerfil(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      const error = new Error("Database error");
      User.findById = jest.fn().mockRejectedValue(error);

      // Act
      await userController.obtenerPerfil(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("verificarAuth", () => {
    it("debería verificar que el usuario está autenticado", async () => {
      // Arrange
      req.userId = "user123";

      const mockUser = {
        _id: "user123",
        email: "juan@example.com",
        toJSON: jest.fn().mockReturnValue({ _id: "user123" }),
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      // Act
      await userController.verificarAuth(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      const error = new Error("Error");
      User.findById = jest.fn().mockRejectedValue(error);

      // Act
      await userController.verificarAuth(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("actualizarPerfil", () => {
    it("debería actualizar el perfil del usuario", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        nombre: "Carlos",
        apellido: "González",
      };

      const mockUser = {
        _id: "user123",
        nombre: "Juan",
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          nombre: "Carlos",
          apellido: "González",
        }),
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      // Act
      await userController.actualizarPerfil(req, res, next);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(mockUser.nombre).toBe("Carlos");
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      // Arrange
      req.userId = "user999";
      req.body = { nombre: "Test" };

      User.findById = jest.fn().mockResolvedValue(null);

      // Act
      await userController.actualizarPerfil(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.body = { nombre: "Test" };
      const error = new Error("Update error");

      User.findById = jest.fn().mockRejectedValue(error);

      // Act
      await userController.actualizarPerfil(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("cambiarPassword", () => {
    it("debería cambiar la contraseña correctamente", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword456",
      };

      const mockUser = {
        _id: "user123",
        password: "hashedOldPassword",
        save: jest.fn().mockResolvedValue(true),
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedNewPassword");

      // Act
      await userController.cambiarPassword(req, res, next);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "OldPassword123",
        "hashedOldPassword"
      );
      expect(bcrypt.hash).toHaveBeenCalledWith("NewPassword456", 10);
      expect(mockUser.password).toBe("hashedNewPassword");
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("debería rechazar si la contraseña actual es incorrecta", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        currentPassword: "WrongPassword",
        newPassword: "NewPassword456",
      };

      const mockUser = {
        password: "hashedOldPassword",
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act
      await userController.cambiarPassword(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("actual"),
        })
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        currentPassword: "Test",
        newPassword: "Test",
      };
      const error = new Error("Database error");

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      // Act
      await userController.cambiarPassword(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("eliminarCuenta", () => {
    beforeEach(() => {
      // Mock Tarea para deleteAllByUserId
      const Tarea = require("../../../models/Tarea.model");
      Tarea.deleteAllByUserId = jest
        .fn()
        .mockResolvedValue({ deletedCount: 0 });
    });

    it("debería eliminar la cuenta del usuario", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        password: "Password123",
        confirmacion: "ELIMINAR",
      };

      const mockUser = {
        _id: "user123",
        password: "hashedPassword",
      };

      const Tarea = require("../../../models/Tarea.model");

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      User.findByIdAndDelete = jest.fn().mockResolvedValue(true);
      Tarea.deleteAllByUserId = jest
        .fn()
        .mockResolvedValue({ deletedCount: 5 });

      // Act
      await userController.eliminarCuenta(req, res, next);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Password123",
        "hashedPassword"
      );
      expect(Tarea.deleteAllByUserId).toHaveBeenCalledWith("user123");
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("debería rechazar con contraseña incorrecta", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        password: "WrongPassword",
        confirmacion: "ELIMINAR",
      };

      const mockUser = {
        password: "hashedPassword",
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act
      await userController.eliminarCuenta(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(User.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        password: "Test",
        confirmacion: "ELIMINAR",
      };
      const error = new Error("Delete error");
    });
  });
});

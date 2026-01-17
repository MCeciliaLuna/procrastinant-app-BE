const tareasController = require("../../../controllers/tareas.controller");
const Tarea = require("../../../models/Tarea.model");
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require("../../helpers/test-helpers");

// Mocks
jest.mock("../../../models/Tarea.model");

describe("Tareas Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("obtenerTareas", () => {
    it("debería obtener todas las tareas del usuario", async () => {
      // Arrange
      req.userId = "user123";
      req.query = {};

      const mockTareas = [
        { _id: "1", descripcion: "Tarea 1", listo: false, userId: "user123" },
        { _id: "2", descripcion: "Tarea 2", listo: true, userId: "user123" },
      ];

      Tarea.findByUserId = jest.fn().mockResolvedValue(mockTareas);

      // Act
      await tareasController.obtenerTareas(req, res, next);

      // Assert
      expect(Tarea.findByUserId).toHaveBeenCalledWith("user123", {
        listo: null,
        sort: "createdAt",
        order: "desc",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            tareas: mockTareas,
            total: 2,
          }),
        })
      );
    });

    it("debería filtrar tareas por estado listo", async () => {
      // Arrange
      req.userId = "user123";
      req.query = { listo: "true" };

      const mockTareas = [
        { _id: "2", descripcion: "Tarea 2", listo: true, userId: "user123" },
      ];

      Tarea.findByUserId = jest.fn().mockResolvedValue(mockTareas);

      // Act
      await tareasController.obtenerTareas(req, res, next);

      // Assert
      expect(Tarea.findByUserId).toHaveBeenCalledWith("user123", {
        listo: true,
        sort: "createdAt",
        order: "desc",
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tareas: mockTareas,
            total: 1,
          }),
        })
      );
    });

    it("debería manejar ordenamiento personalizado", async () => {
      // Arrange
      req.userId = "user123";
      req.query = { sort: "descripcion", order: "asc" };

      Tarea.findByUserId = jest.fn().mockResolvedValue([]);

      // Act
      await tareasController.obtenerTareas(req, res, next);

      // Assert
      expect(Tarea.findByUserId).toHaveBeenCalledWith("user123", {
        listo: null,
        sort: "descripcion",
        order: "asc",
      });
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      const error = new Error("Database error");
      Tarea.findByUserId = jest.fn().mockRejectedValue(error);

      // Act
      await tareasController.obtenerTareas(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("crearTarea", () => {
    it("debería crear una nueva tarea", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        descripcion: "Nueva tarea",
        listo: false,
      };

      const mockTarea = {
        _id: "tarea123",
        descripcion: "Nueva tarea",
        listo: false,
        userId: "user123",
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: "tarea123",
          descripcion: "Nueva tarea",
          listo: false,
          userId: "user123",
        }),
      };

      Tarea.mockImplementation(() => mockTarea);

      // Act
      await tareasController.crearTarea(req, res, next);

      // Assert
      expect(mockTarea.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("creada"),
        })
      );
    });

    it("debería usar listo=false por defecto", async () => {
      // Arrange
      req.userId = "user123";
      req.body = {
        descripcion: "Nueva tarea",
      };

      const mockTarea = {
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({}),
      };

      Tarea.mockImplementation(() => mockTarea);

      // Act
      await tareasController.crearTarea(req, res, next);

      // Assert
      expect(Tarea).toHaveBeenCalledWith(
        expect.objectContaining({
          listo: false,
        })
      );
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.body = { descripcion: "Test" };
      const error = new Error("Save error");

      const mockTarea = {
        save: jest.fn().mockRejectedValue(error),
      };

      Tarea.mockImplementation(() => mockTarea);

      // Act
      await tareasController.crearTarea(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("actualizarTarea", () => {
    it("debería actualizar una tarea existente", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      req.body = { descripcion: "Tarea actualizada" };

      const mockTarea = {
        _id: "tarea123",
        userId: "user123",
        descripcion: "Tarea original",
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: "tarea123",
          descripcion: "Tarea actualizada",
        }),
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.actualizarTarea(req, res, next);

      // Assert
      expect(Tarea.findById).toHaveBeenCalledWith("tarea123");
      expect(mockTarea.descripcion).toBe("Tarea actualizada");
      expect(mockTarea.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("debería devolver 404 si la tarea no existe", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea999" };
      req.body = { descripcion: "Test" };

      Tarea.findById = jest.fn().mockResolvedValue(null);

      // Act
      await tareasController.actualizarTarea(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("no encontrada"),
        })
      );
    });

    it("debería devolver 403 si el usuario no es el dueño", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      req.body = { descripcion: "Test" };

      const mockTarea = {
        _id: "tarea123",
        userId: "otherUser",
        toString: () => "otherUser",
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.actualizarTarea(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("permisos"),
        })
      );
    });

    it("debería llamar a next()en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      const error = new Error("Database error");

      Tarea.findById = jest.fn().mockRejectedValue(error);

      // Act
      await tareasController.actualizarTarea(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("toggleTarea", () => {
    it("debería cambiar el estado de una tarea", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      req.body = {};

      const mockTarea = {
        _id: "tarea123",
        userId: "user123",
        listo: false,
        toggle: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ listo: true }),
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.toggleTarea(req, res, next);

      // Assert
      expect(mockTarea.toggle).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("debería permitir establecer listo directamente", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      req.body = { listo: true };

      const mockTarea = {
        _id: "tarea123",
        userId: "user123",
        listo: false,
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ listo: true }),
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.toggleTarea(req, res, next);

      // Assert
      expect(mockTarea.listo).toBe(true);
      expect(mockTarea.save).toHaveBeenCalled();
    });

    it("debería validar ownership", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      req.body = {};

      const mockTarea = {
        _id: "tarea123",
        userId: { toString: () => "otherUser" },
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.toggleTarea(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("eliminarTarea", () => {
    it("debería eliminar una tarea existente", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };

      const mockTarea = {
        _id: "tarea123",
        userId: "user123",
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);
      Tarea.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      // Act
      await tareasController.eliminarTarea(req, res, next);

      // Assert
      expect(Tarea.findByIdAndDelete).toHaveBeenCalledWith("tarea123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("eliminada"),
        })
      );
    });

    it("debería devolver 404 si la tarea no existe", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea999" };

      Tarea.findById = jest.fn().mockResolvedValue(null);

      // Act
      await tareasController.eliminarTarea(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(Tarea.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("debería validar ownership antes de eliminar", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };

      const mockTarea = {
        _id: "tarea123",
        userId: { toString: () => "otherUser" },
      };

      Tarea.findById = jest.fn().mockResolvedValue(mockTarea);

      // Act
      await tareasController.eliminarTarea(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(Tarea.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("debería llamar a next() en caso de error", async () => {
      // Arrange
      req.userId = "user123";
      req.params = { id: "tarea123" };
      const error = new Error("Database error");

      Tarea.findById = jest.fn().mockRejectedValue(error);

      // Act
      await tareasController.eliminarTarea(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

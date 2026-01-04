const Tarea = require("../../../models/Tarea.model");
const User = require("../../../models/User.model");
require("../../setup");

describe("Tarea Model", () => {
  let userId;

  beforeEach(async () => {
    const user = await new User({
      nombre: "Test",
      apellido: "User",
      alias: "testuser",
      email: "test@example.com",
      password: "password123",
    }).save();

    userId = user._id;
  });

  describe("Validaciones", () => {
    it("debería crear una tarea válida", async () => {
      const tarea = new Tarea({
        userId: userId,
        descripcion: "Test tarea",
        listo: false,
      });

      await tarea.save();

      expect(tarea.descripcion).toBe("Test tarea");
      expect(tarea.listo).toBe(false);
      expect(tarea.userId.toString()).toBe(userId.toString());
    });

    it("debería tener listo=false por defecto", async () => {
      const tarea = new Tarea({
        userId: userId,
        descripcion: "Test tarea",
      });

      await tarea.save();
      expect(tarea.listo).toBe(false);
    });

    it("debería fallar sin descripcion", async () => {
      const tarea = new Tarea({
        userId: userId,
        listo: false,
      });

      await expect(tarea.save()).rejects.toThrow();
    });

    it("debería fallar sin userId", async () => {
      const tarea = new Tarea({
        descripcion: "Test tarea",
      });

      await expect(tarea.save()).rejects.toThrow();
    });
  });

  describe("Métodos", () => {
    it("toggle debería cambiar estado", async () => {
      const tarea = new Tarea({
        userId: userId,
        descripcion: "Test tarea",
        listo: false,
      });

      await tarea.save();
      expect(tarea.listo).toBe(false);

      await tarea.toggle();
      expect(tarea.listo).toBe(true);

      await tarea.toggle();
      expect(tarea.listo).toBe(false);
    });

    it("findByUserId debería encontrar tareas del usuario", async () => {
      await new Tarea({
        userId: userId,
        descripcion: "Tarea 1",
      }).save();

      await new Tarea({
        userId: userId,
        descripcion: "Tarea 2",
      }).save();

      const tareas = await Tarea.findByUserId(userId);
      expect(tareas).toHaveLength(2);
    });

    it("findByUserId debería filtrar por listo", async () => {
      await new Tarea({
        userId: userId,
        descripcion: "Tarea 1",
        listo: false,
      }).save();

      await new Tarea({
        userId: userId,
        descripcion: "Tarea 2",
        listo: true,
      }).save();

      const tareasPendientes = await Tarea.findByUserId(userId, {
        listo: false,
      });
      expect(tareasPendientes).toHaveLength(1);
      expect(tareasPendientes[0].listo).toBe(false);

      const tareasCompletadas = await Tarea.findByUserId(userId, {
        listo: true,
      });
      expect(tareasCompletadas).toHaveLength(1);
      expect(tareasCompletadas[0].listo).toBe(true);
    });

    it("countByUserId debería contar tareas", async () => {
      await new Tarea({
        userId: userId,
        descripcion: "Tarea 1",
      }).save();

      await new Tarea({
        userId: userId,
        descripcion: "Tarea 2",
      }).save();

      const count = await Tarea.countByUserId(userId);
      expect(count).toBe(2);
    });

    it("toJSON debería ocultar __v", async () => {
      const tarea = new Tarea({
        userId: userId,
        descripcion: "Test tarea",
      });

      await tarea.save();
      const tareaJSON = tarea.toJSON();

      expect(tareaJSON.__v).toBeUndefined();
      expect(tareaJSON.descripcion).toBe("Test tarea");
    });
  });
});

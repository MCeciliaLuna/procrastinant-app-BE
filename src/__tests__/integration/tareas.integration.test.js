const request = require("supertest");
const express = require("express");
const Tarea = require("../../models/Tarea.model");
const {
  createAuthenticatedUser,
  createTestTarea,
  createTestTareas,
  validateApiResponse,
  createAuthCookie,
} = require("../helpers/test-helpers");

// Import app setup
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const tareasRoutes = require("../../routes/tareas.routes");
app.use("/api/tareas", tareasRoutes);

// Import error handlers
const {
  errorHandler,
  notFoundHandler,
} = require("../../middlewares/errorHandler.middleware");
app.use(notFoundHandler);
app.use(errorHandler);

describe("Tareas Integration Tests", () => {
  let user1, token1, user2, token2;

  beforeEach(async () => {
    // Crear dos usuarios para tests de autorización
    const auth1 = await createAuthenticatedUser({
      email: "user1@example.com",
      alias: "user1",
    });
    user1 = auth1.user;
    token1 = auth1.token;

    const auth2 = await createAuthenticatedUser({
      email: "user2@example.com",
      alias: "user2",
    });
    user2 = auth2.user;
    token2 = auth2.token;
  });

  describe("GET /api/tareas", () => {
    it("debería obtener todas las tareas del usuario autenticado", async () => {
      // Crear tareas para user1
      await createTestTareas(user1._id, 3);

      const response = await request(app)
        .get("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tareas).toBeDefined();
      expect(Array.isArray(response.body.data.tareas)).toBe(true);
      expect(response.body.data.tareas).toHaveLength(3);
      expect(response.body.data.total).toBe(3);
    });

    it("debería filtrar tareas por estado listo=true", async () => {
      await createTestTarea(user1._id, { descripcion: "Tarea 1", listo: true });
      await createTestTarea(user1._id, {
        descripcion: "Tarea 2",
        listo: false,
      });
      await createTestTarea(user1._id, { descripcion: "Tarea 3", listo: true });

      const response = await request(app)
        .get("/api/tareas?listo=true")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tareas).toHaveLength(2);
      expect(response.body.data.tareas.every((t) => t.listo === true)).toBe(
        true
      );
    });

    it("debería filtrar tareas por estado listo=false", async () => {
      await createTestTarea(user1._id, { descripcion: "Tarea 1", listo: true });
      await createTestTarea(user1._id, {
        descripcion: "Tarea 2",
        listo: false,
      });
      await createTestTarea(user1._id, {
        descripcion: "Tarea 3",
        listo: false,
      });

      const response = await request(app)
        .get("/api/tareas?listo=false")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tareas).toHaveLength(2);
      expect(response.body.data.tareas.every((t) => t.listo === false)).toBe(
        true
      );
    });

    it("NO debería mostrar tareas de otros usuarios", async () => {
      // Crear tareas para user1
      await createTestTareas(user1._id, 2);

      // Crear tareas para user2
      await createTestTareas(user2._id, 3);

      // User1 solo debe ver sus propias tareas
      const response = await request(app)
        .get("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      expect(response.body.data.tareas).toHaveLength(2);
    });

    it("debería devolver array vacío si el usuario no tiene tareas", async () => {
      const response = await request(app)
        .get("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tareas).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });

    it("debería rechazar petición sin token", async () => {
      const response = await request(app).get("/api/tareas").expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("POST /api/tareas", () => {
    it("debería crear una nueva tarea", async () => {
      const tareaData = {
        descripcion: "Nueva tarea de prueba",
        listo: false,
      };

      const response = await request(app)
        .post("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .send(tareaData)
        .expect(201);

      validateApiResponse(response.body, true);
      expect(response.body.data.tarea).toBeDefined();
      expect(response.body.data.tarea.descripcion).toBe(tareaData.descripcion);
      expect(response.body.data.tarea.listo).toBe(false);
      expect(response.body.data.tarea.userId).toBe(user1._id.toString());

      // Verificar que existe en BD
      const tareaInDb = await Tarea.findById(response.body.data.tarea._id);
      expect(tareaInDb).toBeDefined();
    });

    it("debería crear tarea con listo=false por defecto", async () => {
      const tareaData = {
        descripcion: "Nueva tarea",
      };

      const response = await request(app)
        .post("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .send(tareaData)
        .expect(201);

      expect(response.body.data.tarea.listo).toBe(false);
    });

    it("debería rechazar tarea sin descripción", async () => {
      const tareaData = {
        listo: false,
      };

      const response = await request(app)
        .post("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .send(tareaData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar descripción muy larga (>300 caracteres)", async () => {
      const tareaData = {
        descripcion: "a".repeat(301),
      };

      const response = await request(app)
        .post("/api/tareas")
        .set("Cookie", [createAuthCookie(token1)])
        .send(tareaData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar petición sin autenticación", async () => {
      const tareaData = {
        descripcion: "Nueva tarea",
      };

      const response = await request(app)
        .post("/api/tareas")
        .send(tareaData)
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("PUT /api/tareas/:id", () => {
    let tarea1;

    beforeEach(async () => {
      tarea1 = await createTestTarea(user1._id, {
        descripcion: "Tarea original",
      });
    });

    it("debería actualizar una tarea existente", async () => {
      const updateData = {
        descripcion: "Tarea actualizada",
      };

      const response = await request(app)
        .put(`/api/tareas/${tarea1._id}`)
        .set("Cookie", [createAuthCookie(token1)])
        .send(updateData)
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tarea.descripcion).toBe(updateData.descripcion);

      // Verificar en BD
      const tareaInDb = await Tarea.findById(tarea1._id);
      expect(tareaInDb.descripcion).toBe(updateData.descripcion);
    });

    it("NO debería permitir actualizar tarea de otro usuario", async () => {
      const updateData = {
        descripcion: "Intentando actualizar",
      };

      // User2 intenta actualizar tarea de User1
      const response = await request(app)
        .put(`/api/tareas/${tarea1._id}`)
        .set("Cookie", [createAuthCookie(token2)])
        .send(updateData)
        .expect(403); // Forbidden when not owner

      validateApiResponse(response.body, false);
    });

    it("debería rechazar ID inválido", async () => {
      const updateData = {
        descripcion: "Nueva descripción",
      };

      const response = await request(app)
        .put("/api/tareas/invalid-id")
        .set("Cookie", [createAuthCookie(token1)])
        .send(updateData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar actualización sin autenticación", async () => {
      const updateData = {
        descripcion: "Nueva descripción",
      };

      const response = await request(app)
        .put(`/api/tareas/${tarea1._id}`)
        .send(updateData)
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("PATCH /api/tareas/:id/toggle", () => {
    let tarea1;

    beforeEach(async () => {
      tarea1 = await createTestTarea(user1._id, {
        descripcion: "Tarea para toggle",
        listo: false,
      });
    });

    it("debería cambiar estado de false a true", async () => {
      const response = await request(app)
        .patch(`/api/tareas/${tarea1._id}/toggle`)
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.tarea.listo).toBe(true);

      // Verificar en BD
      const tareaInDb = await Tarea.findById(tarea1._id);
      expect(tareaInDb.listo).toBe(true);
    });

    it("debería cambiar estado de true a false", async () => {
      // Primero marcar como listo
      tarea1.listo = true;
      await tarea1.save();

      const response = await request(app)
        .patch(`/api/tareas/${tarea1._id}/toggle`)
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      expect(response.body.data.tarea.listo).toBe(false);
    });

    it("NO debería permitir toggle de tarea de otro usuario", async () => {
      const response = await request(app)
        .patch(`/api/tareas/${tarea1._id}/toggle`)
        .set("Cookie", [createAuthCookie(token2)])
        .expect(403);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar sin autenticación", async () => {
      const response = await request(app)
        .patch(`/api/tareas/${tarea1._id}/toggle`)
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("DELETE /api/tareas/:id", () => {
    let tarea1;

    beforeEach(async () => {
      tarea1 = await createTestTarea(user1._id, {
        descripcion: "Tarea para eliminar",
      });
    });

    it("debería eliminar una tarea existente", async () => {
      const response = await request(app)
        .delete(`/api/tareas/${tarea1._id}`)
        .set("Cookie", [createAuthCookie(token1)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.message).toContain("eliminada");

      // Verificar que no existe en BD
      const tareaInDb = await Tarea.findById(tarea1._id);
      expect(tareaInDb).toBeNull();
    });

    it("NO debería permitir eliminar tarea de otro usuario", async () => {
      const response = await request(app)
        .delete(`/api/tareas/${tarea1._id}`)
        .set("Cookie", [createAuthCookie(token2)])
        .expect(403);

      validateApiResponse(response.body, false);

      // Verificar que la tarea sigue existiendo
      const tareaInDb = await Tarea.findById(tarea1._id);
      expect(tareaInDb).toBeDefined();
    });

    it("debería devolver 404 para tarea inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011"; // ObjectId válido pero inexistente

      const response = await request(app)
        .delete(`/api/tareas/${fakeId}`)
        .set("Cookie", [createAuthCookie(token1)])
        .expect(404);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar ID inválido", async () => {
      const response = await request(app)
        .delete("/api/tareas/invalid-id")
        .set("Cookie", [createAuthCookie(token1)])
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar sin autenticación", async () => {
      const response = await request(app)
        .delete(`/api/tareas/${tarea1._id}`)
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });
});

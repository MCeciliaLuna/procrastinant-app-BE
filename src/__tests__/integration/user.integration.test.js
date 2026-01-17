const request = require("supertest");
const express = require("express");
const User = require("../../models/User.model");
const bcrypt = require("bcrypt");
const {
  createAuthenticatedUser,
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
const userRoutes = require("../../routes/user.routes");
app.use("/api/user", userRoutes);

// Import error handlers
const {
  errorHandler,
  notFoundHandler,
} = require("../../middlewares/errorHandler.middleware");
app.use(notFoundHandler);
app.use(errorHandler);

describe("User Integration Tests", () => {
  let user, token;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser({
      nombre: "Juan",
      apellido: "Pérez",
      alias: "juanp",
      email: "juan@example.com",
    });
    user = auth.user;
    token = auth.token;
  });

  describe("GET /api/user/profile", () => {
    it("debería obtener el perfil del usuario autenticado", async () => {
      const response = await request(app)
        .get("/api/user/profile")
        .set("Cookie", [createAuthCookie(token)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.user.nombre).toBe(user.nombre);
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("debería rechazar sin token", async () => {
      const response = await request(app).get("/api/user/profile").expect(401);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar con token inválido", async () => {
      const response = await request(app)
        .get("/api/user/profile")
        .set("Cookie", [createAuthCookie("invalid-token")])
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("GET /api/user/verify", () => {
    it("debería verificar que el token es válido", async () => {
      const response = await request(app)
        .get("/api/user/verify")
        .set("Cookie", [createAuthCookie(token)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user._id).toBe(user._id.toString());
    });

    it("debería rechazar token inválido", async () => {
      const response = await request(app)
        .get("/api/user/verify")
        .set("Cookie", [createAuthCookie("invalid-token")])
        .expect(401);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar sin token", async () => {
      const response = await request(app).get("/api/user/verify").expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("PUT /api/user/profile", () => {
    it("debería actualizar el perfil del usuario", async () => {
      const updateData = {
        nombre: "Carlos",
        apellido: "González",
        alias: "carlosg",
      };

      const response = await request(app)
        .put("/api/user/profile")
        .set("Cookie", [createAuthCookie(token)])
        .send(updateData)
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data.user.nombre).toBe(updateData.nombre);
      expect(response.body.data.user.apellido).toBe(updateData.apellido);
      expect(response.body.data.user.alias).toBe(updateData.alias);

      // Verificar en BD
      const userInDb = await User.findById(user._id);
      expect(userInDb.nombre).toBe(updateData.nombre);
    });

    it("debería rechazar actualización con datos inválidos", async () => {
      const updateData = {
        nombre: "A", // Muy corto
      };

      const response = await request(app)
        .put("/api/user/profile")
        .set("Cookie", [createAuthCookie(token)])
        .send(updateData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar actualización sin autenticación", async () => {
      const updateData = {
        nombre: "Carlos",
      };

      const response = await request(app)
        .put("/api/user/profile")
        .send(updateData)
        .expect(401);

      validateApiResponse(response.body, false);
    });

    it("debería permitir cambiar el email si no está duplicado", async () => {
      const updateData = {
        email: "nuevo@example.com",
      };

      const response = await request(app)
        .put("/api/user/profile")
        .set("Cookie", [createAuthCookie(token)])
        .send(updateData)
        .expect(200);

      // El email sí debe cambiar si no está duplicado
      const userInDb = await User.findById(user._id);
      expect(userInDb.email).toBe("nuevo@example.com");
    });
  });

  describe("PUT /api/user/password", () => {
    beforeEach(async () => {
      // Asegurar que el usuario tenga una contraseña conocida
      const hashedPassword = await bcrypt.hash("OldPassword123", 10);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    });

    it("debería cambiar la contraseña correctamente", async () => {
      const passwordData = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456",
      };

      const response = await request(app)
        .put("/api/user/password")
        .set("Cookie", [createAuthCookie(token)])
        .send(passwordData)
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.message).toContain("Contraseña");

      // Verificar que la contraseña fue actualizada (está hasheada)
      const userInDb = await User.findById(user._id);
      expect(userInDb.password).toBeDefined();
      expect(userInDb.password).not.toBe("NewPassword456"); // Debe estar hasheada
    });

    it("debería rechazar si la contraseña actual es incorrecta", async () => {
      const passwordData = {
        currentPassword: "WrongPassword",
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456",
      };

      const response = await request(app)
        .put("/api/user/password")
        .set("Cookie", [createAuthCookie(token)])
        .send(passwordData)
        .expect(401);

      validateApiResponse(response.body, false);
      expect(response.body.message).toContain("actual");
    });

    it("debería rechazar nueva contraseña débil", async () => {
      const passwordData = {
        currentPassword: "OldPassword123",
        newPassword: "123", // Muy corta
        confirmPassword: "123",
      };

      const response = await request(app)
        .put("/api/user/password")
        .set("Cookie", [createAuthCookie(token)])
        .send(passwordData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar sin currentPassword", async () => {
      const passwordData = {
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456",
      };

      const response = await request(app)
        .put("/api/user/password")
        .set("Cookie", [createAuthCookie(token)])
        .send(passwordData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar sin autenticación", async () => {
      const passwordData = {
        currentPassword: "OldPassword123",
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456",
      };

      const response = await request(app)
        .put("/api/user/password")
        .send(passwordData)
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });

  describe("DELETE /api/user/account", () => {
    beforeEach(async () => {
      // Asegurar que el usuario tenga una contraseña conocida
      const hashedPassword = await bcrypt.hash("OldPassword123", 10);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    });

    it("debería eliminar la cuenta del usuario", async () => {
      const deleteData = {
        password: "OldPassword123",
        confirmacion: "ELIMINAR",
      };

      const response = await request(app)
        .delete("/api/user/account")
        .set("Cookie", [createAuthCookie(token)])
        .send(deleteData)
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.message).toContain("eliminada");

      // Verificar que el usuario ya no existe
      const userInDb = await User.findById(user._id);
      expect(userInDb).toBeNull();
    });

    it("debería rechazar sin autenticación", async () => {
      const response = await request(app)
        .delete("/api/user/account")
        .expect(401);

      validateApiResponse(response.body, false);

      // Verificar que el usuario sigue existiendo
      const userInDb = await User.findById(user._id);
      expect(userInDb).toBeDefined();
    });
  });
});

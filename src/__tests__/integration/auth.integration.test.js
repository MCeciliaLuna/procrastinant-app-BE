const request = require("supertest");
const express = require("express");
const User = require("../../models/User.model");
const {
  createTestUser,
  createAuthenticatedUser,
  validateApiResponse,
  validUserData,
  createAuthCookie,
} = require("../helpers/test-helpers");

// Import app setup (without starting server)
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
const authRoutes = require("../../routes/auth.routes");
app.use("/api/auth", authRoutes);

// Import error handlers
const {
  errorHandler,
  notFoundHandler,
} = require("../../middlewares/errorHandler.middleware");
app.use(notFoundHandler);
app.use(errorHandler);

describe("Auth Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("debería registrar un nuevo usuario exitosamente", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      validateApiResponse(response.body, true);
      expect(response.body.data).toHaveProperty("user");
      // Token should be in HTTP-only cookie
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(
        response.headers["set-cookie"].some((cookie) =>
          cookie.startsWith("authToken=")
        )
      ).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email.toLowerCase());
      expect(response.body.data.user.nombre).toBe(userData.nombre);
      expect(response.body.data.user).not.toHaveProperty("password");

      // Verificar que el usuario existe en la BD
      const userInDb = await User.findOne({ email: userData.email });
      expect(userInDb).toBeDefined();
      expect(userInDb.nombre).toBe(userData.nombre);
    });

    it("debería rechazar registro sin email", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      validateApiResponse(response.body, false);
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it("debería rechazar registro con email inválido", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "invalid-email",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar registro con password débil", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar email duplicado", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "juan@example.com",
        password: "Password123",
      };

      // Primer registro
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Intento de registro duplicado
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...userData,
          alias: "juanp2", // Cambiar alias
        })
        .expect(400);

      validateApiResponse(response.body, false);
      expect(response.body.message).toContain("registrado");
    });

    it("debería convertir email a lowercase", async () => {
      const userData = {
        nombre: "Juan",
        apellido: "Pérez",
        alias: "juanp",
        email: "JUAN@EXAMPLE.COM",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.data.user.email).toBe("juan@example.com");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Crear usuario de prueba antes de cada test de login
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("Password123", 10);

      await new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: hashedPassword,
      }).save();
    });

    it("debería hacer login exitosamente con credenciales correctas", async () => {
      const credentials = {
        email: "test@example.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.data).toHaveProperty("user");
      // Token should be in HTTP-only cookie
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(
        response.headers["set-cookie"].some((cookie) =>
          cookie.startsWith("authToken=")
        )
      ).toBe(true);
      expect(response.body.data.user.email).toBe(credentials.email);
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("debería ser case-insensitive con el email", async () => {
      const credentials = {
        email: "TEST@EXAMPLE.COM",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      validateApiResponse(response.body, true);
    });

    it("debería rechazar login con email inexistente", async () => {
      const credentials = {
        email: "noexiste@example.com",
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      validateApiResponse(response.body, false);
      expect(response.body.message).toContain("Credenciales");
    });

    it("debería rechazar login con password incorrecta", async () => {
      const credentials = {
        email: "test@example.com",
        password: "WrongPassword",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(401);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar login sin email", async () => {
      const credentials = {
        password: "Password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(400);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar login sin password", async () => {
      const credentials = {
        email: "test@example.com",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(400);

      validateApiResponse(response.body, false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("debería hacer logout exitosamente con token válido", async () => {
      const { user, token } = await createAuthenticatedUser();

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", [createAuthCookie(token)])
        .expect(200);

      validateApiResponse(response.body, true);
      expect(response.body.message).toContain("Sesión cerrada");
    });

    it("debería rechazar logout sin token", async () => {
      const response = await request(app).post("/api/auth/logout").expect(401);

      validateApiResponse(response.body, false);
    });

    it("debería rechazar logout con token inválido", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", [createAuthCookie("invalid-token")])
        .expect(401);

      validateApiResponse(response.body, false);
    });
  });
});

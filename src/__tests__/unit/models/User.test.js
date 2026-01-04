const User = require("../../../models/User.model");
require("../../setup");

describe("User Model", () => {
  describe("Validaciones", () => {
    it("debería crear un usuario válido", async () => {
      const userData = {
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: "hashedpassword123",
      };

      const user = new User(userData);
      await user.save();

      expect(user.nombre).toBe("Test");
      expect(user.email).toBe("test@example.com");
      expect(user._id).toBeDefined();
    });

    it("debería fallar sin email", async () => {
      const user = new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        password: "password123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("debería convertir email a lowercase", async () => {
      const user = new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      });

      await user.save();
      expect(user.email).toBe("test@example.com");
    });

    it("debería rechazar email duplicado", async () => {
      const userData = {
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await new User(userData).save();

      const duplicateUser = new User({
        ...userData,
        alias: "testuser2",
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe("Métodos", () => {
    it("toJSON debería ocultar password", async () => {
      const user = new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      await user.save();
      const userJSON = user.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.__v).toBeUndefined();
      expect(userJSON.email).toBe("test@example.com");
    });

    it("findByEmail debería encontrar usuario", async () => {
      await new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: "password123",
      }).save();

      const found = await User.findByEmail("test@example.com");
      expect(found).toBeDefined();
      expect(found.email).toBe("test@example.com");
    });

    it("findByEmail debería ser case-insensitive", async () => {
      await new User({
        nombre: "Test",
        apellido: "User",
        alias: "testuser",
        email: "test@example.com",
        password: "password123",
      }).save();

      const found = await User.findByEmail("TEST@EXAMPLE.COM");
      expect(found).toBeDefined();
      expect(found.email).toBe("test@example.com");
    });
  });
});

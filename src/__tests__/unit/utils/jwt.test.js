const { generateToken, verifyToken } = require("../../../utils/jwt.utils");

describe("JWT Utils", () => {
  const testUserId = "507f1f77bcf86cd799439011";

  describe("generateToken", () => {
    it("debería generar un token válido", () => {
      const token = generateToken(testUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("debería incluir userId en el token", () => {
      const token = generateToken(testUserId);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(testUserId);
    });

    it("debería incluir issuer", () => {
      const token = generateToken(testUserId);
      const decoded = verifyToken(token);

      expect(decoded.iss).toBe("procrastinant-app");
    });
  });

  describe("verifyToken", () => {
    it("debería verificar token correcto", () => {
      const token = generateToken(testUserId);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.iss).toBe("procrastinant-app");
    });

    it("debería rechazar token inválido", () => {
      expect(() => verifyToken("invalid-token")).toThrow();
    });

    it("debería rechazar token vacío", () => {
      expect(() => verifyToken("")).toThrow();
    });

    it("debería rechazar token malformado", () => {
      expect(() => verifyToken("malformed.token")).toThrow();
    });
  });
});

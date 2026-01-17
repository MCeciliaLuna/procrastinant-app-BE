const request = require("supertest");
const express = require("express");

// Import app setup
const app = express();
app.use(express.json());

// Import main routes (health is there)
const routes = require("../../routes");
app.use("/api", routes);

// Import error handlers
const {
  errorHandler,
  notFoundHandler,
} = require("../../middlewares/errorHandler.middleware");
app.use(notFoundHandler);
app.use(errorHandler);

describe("Health Integration Tests", () => {
  describe("GET /api/health", () => {
    it("debería devolver estado OK", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("status", "OK");
      expect(response.body.data).toHaveProperty("timestamp");
    });

    it("debería ser accesible sin autenticación", async () => {
      // No debe requerir token
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body.data.status).toBe("OK");
    });
  });
});

const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const tareasRoutes = require("./tareas.routes");
const userRoutes = require("./user.routes");

const { successResponse } = require("../utils/response.utils");

router.get("/health", (req, res) => {
  const healthInfo = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: require("../../package.json").version || "1.0.0",
    database: "MongoDB",
  };

  return successResponse(res, 200, "API funcionando correctamente", healthInfo);
});

router.use("/auth", authRoutes);

router.use("/tareas", tareasRoutes);

router.use("/user", userRoutes);

router.get("/", (req, res) => {
  const apiInfo = {
    name: "Procrastinant API",
    version: require("../../package.json").version || "1.0.0",
    description: "API REST para gestión de tareas",
    endpoints: {
      auth: "/api/auth",
      tareas: "/api/tareas",
      user: "/api/user",
      health: "/api/health",
    },
    documentation: "Ver README.md para documentación completa",
  };

  return successResponse(
    res,
    200,
    "Bienvenido a la API de Procrastinant",
    apiInfo
  );
});

module.exports = router;

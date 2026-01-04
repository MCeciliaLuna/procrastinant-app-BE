const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require("./src/config/database");
const routes = require("./src/routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middlewares/errorHandler.middleware");

const app = express();

connectDB();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  process.env.DEPLOY_FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message:
      "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde",
    errors: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la DB de Procrastinant App!",
    author: "https://mcecilialuna-dev.netlify.app/",
    version: require("./package.json").version || "1.0.0",
    documentation: "Ver README.md",
    endpoints: {
      api: "/api",
      health: "/api/health",
      auth: "/api/auth",
      tareas: "/api/tareas",
      user: "/api/user",
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 CORS habilitado para: ${allowedOrigins.join(", ")}`);
  console.log(`🔒 Seguridad: Helmet, Rate Limiting y Cookies activos`);
  console.log(`\n📚 Documentación de API disponible en README.md`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

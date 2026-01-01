require("dotenv").config();

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/procrastinant-app-BE",
  MONGODB_URI_TEST:
    process.env.MONGODB_URI_TEST ||
    "mongodb://localhost:27017/procrastinant-app-BE-test",

  JWT_SECRET: process.env.JWT_SECRET || "default_secret_CHANGE_IN_PRODUCTION",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
};

const validateEnv = () => {
  if (env.NODE_ENV === "production") {
    const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      console.error(`❌ Variables de entorno faltantes: ${missing.join(", ")}`);
      process.exit(1);
    }

    if (env.JWT_SECRET === "default_secret_CHANGE_IN_PRODUCTION") {
      console.error("❌ JWT_SECRET debe ser cambiado en producción");
      process.exit(1);
    }
  }
};

validateEnv();

module.exports = env;

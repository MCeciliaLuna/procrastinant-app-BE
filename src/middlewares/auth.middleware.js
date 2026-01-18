const { verifyToken } = require("../utils/jwt.utils");
const { unauthorizedResponse } = require("../utils/response.utils");

const verificarAuth = async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return unauthorizedResponse(res, "Token no proporcionado");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return unauthorizedResponse(res, "Token expirado");
      } else if (error.name === "JsonWebTokenError") {
        return unauthorizedResponse(res, "Token inválido");
      } else {
        return unauthorizedResponse(res, "Error al verificar token");
      }
    }

    const { userId } = decoded;

    if (!userId) {
      return unauthorizedResponse(res, "Token inválido - userId no encontrado");
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    return unauthorizedResponse(res, "Error de autenticación");
  }
};

const verificarAuthOpcional = async (req, res, next) => {
  try {
    let token = req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      req.isAuthenticated = false;
      return next();
    }

    const decoded = verifyToken(token);
    const { userId } = decoded;

    if (userId) {
      req.userId = userId;
      req.isAuthenticated = true;
    } else {
      req.isAuthenticated = false;
    }

    next();
  } catch {
    req.isAuthenticated = false;
    next();
  }
};

module.exports = {
  verificarAuth,
  verificarAuthOpcional,
};

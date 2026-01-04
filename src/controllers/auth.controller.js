const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt.utils");
const { successResponse, errorResponse } = require("../utils/response.utils");

exports.register = async (req, res, next) => {
  try {
    const { nombre, apellido, alias, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, "El email ya está registrado", [
        { field: "email", message: "Este email ya está en uso" },
      ]);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      nombre,
      apellido,
      alias,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const userResponse = newUser.toJSON();
    return successResponse(res, 201, "Usuario registrado exitosamente", {
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email).select("+password");
    if (!user) {
      return errorResponse(res, 401, "Credenciales inválidas", [
        { field: "email", message: "Email o contraseña incorrectos" },
      ]);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Credenciales inválidas", [
        { field: "password", message: "Email o contraseña incorrectos" },
      ]);
    }

    const token = generateToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const userResponse = user.toJSON();
    return successResponse(res, 200, "Inicio de sesión exitoso", {
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return successResponse(res, 200, "Sesión cerrada exitosamente", null);
  } catch (error) {
    next(error);
  }
};

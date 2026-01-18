const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
  const payload = {
    userId: userId,
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: "procrastinant-app",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
};

exports.verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

exports.decodeToken = (token) => {
  return jwt.decode(token);
};

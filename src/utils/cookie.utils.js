const COOKIE_NAME = "authToken";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
};

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

module.exports = {
  COOKIE_NAME,
  COOKIE_MAX_AGE,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
};

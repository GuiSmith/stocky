import loginDTO from "../dtos/auth/login.dto.js";
import authService from "../services/auth.service.js";

const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000;

const isSecureRequest = (req) => {
  return (
    req.secure ||
    req.get("x-forwarded-proto") === "https" ||
    process.env.NODE_ENV === "production"
  );
};

const getTokenCookieOptions = (req) => ({
  httpOnly: true,
  secure: isSecureRequest(req),
  sameSite: "lax",
  path: "/",
});

const login = async (req, res) => {
  const dto = loginDTO(req.body);
  const autenticacao = await authService.login(dto);

  res.cookie("token", autenticacao.token, {
    ...getTokenCookieOptions(req),
    maxAge: COOKIE_MAX_AGE,
  });

  return res.status(200).json({
    usuario: autenticacao.usuario,
  });
};

const logout = async (req, res) => {
  res.clearCookie("token", getTokenCookieOptions(req));

  return res.status(204).send();
};

export default {
  login,
  logout,
};

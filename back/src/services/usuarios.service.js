import db from "../config/database.js";
import criarUsuarioDTO from "../dtos/criar-usuario.dto.js";

const sanitizeUsuario = (usuario) => {
  const { senha, ...safeUsuario } = usuario;
  return safeUsuario;
};

const criarUsuario = async (payload) => {
  const usuarioDTO = criarUsuarioDTO(payload);
  const usuario = await db.usuario.create({
    data: usuarioDTO,
  });

  return sanitizeUsuario(usuario);
};

export default {
  criarUsuario,
};

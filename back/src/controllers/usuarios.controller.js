import usuariosService from "../services/usuarios.service.js";

const criarUsuario = async (req, res) => {
  const usuario = await usuariosService.criarUsuario(req.body);

  return res.status(201).json(usuario);
};

export default {
  criarUsuario,
};

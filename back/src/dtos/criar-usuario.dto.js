import BadRequestError from "../errors/bad-request.error.js";

const requiredFields = ["nome", "cpf", "email", "senha"];

const criarUsuarioDTO = (payload = {}) => {
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    throw new BadRequestError("Campos obrigatórios ausentes", {
      fields: missingFields,
    });
  }

  return {
    nome: payload.nome,
    cpf: payload.cpf,
    email: payload.email,
    senha: payload.senha,
    ativo: payload.ativo ?? true,
  };
};

export default criarUsuarioDTO;

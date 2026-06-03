import AppError from "../errors/app.error.js";
import ConflictError from "../errors/conflict.error.js";

const normalizeError = (error) => {
  if (error.code === "P2002") {
    return new ConflictError("Registro já cadastrado", {
      fields: error.meta?.target ?? [],
    });
  }

  return error;
};

const errorMiddleware = (error, req, res, next) => {
  const normalizedError = normalizeError(error);

  if (normalizedError instanceof AppError) {
    const response = {
      error: normalizedError.message,
    };

    if (normalizedError.details) {
      response.details = normalizedError.details;
    }

    return res.status(normalizedError.statusCode).json(response);
  }

  console.error(normalizedError);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
};

export default errorMiddleware;

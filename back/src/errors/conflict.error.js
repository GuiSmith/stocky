import AppError from "./app.error.js";

class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, 409, details);
  }
}

export default ConflictError;

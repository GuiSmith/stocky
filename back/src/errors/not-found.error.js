import AppError from "./app.error.js";

class NotFoundError extends AppError {
  constructor(message = "Not Found", details = null) {
    super(message, 404, details);
  }
}

export default NotFoundError;

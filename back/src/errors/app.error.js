class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export default AppError;

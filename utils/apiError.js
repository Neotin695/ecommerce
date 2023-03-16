class ApiError extends Error {
  constructor(success, error, message, statusCode) {
    super(message);
    this.Success = success;
    this.Error = error;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ApiError;

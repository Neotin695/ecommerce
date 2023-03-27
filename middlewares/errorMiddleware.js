const ApiError = require("../utils/apiError");

const erroDevMode = (error, res) =>
  res.status(400).json({
    Succes: error.Success,
    Error: error,
    Status: error.status,
    Message: error.message,
    Stack: error.stack,
  });

const errorProdMode = (error, res) =>
  res.status(404).json({
    Status: error.status,
    Message: error.message,
  });

const handleJWTInvalideSignature = () =>
  new ApiError(
    false,
    true,
    "invalide authorization!, please authenticate and try again"
  );
const handleExpireToken = () =>
  new ApiError(
    false,
    true,
    "authorization expired!, please authenticate again"
  );

const globleError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  console.log(`mode: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "development") {
    erroDevMode(error, res);
  } else {
    if (error.name === "JsonWebTokenError")
      error = handleJWTInvalideSignature();
    if (error.name === "TokenExpiredError") error = handleExpireToken();
    errorProdMode(error, res);
  }
};

module.exports = globleError;

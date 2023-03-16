const erroDevMode = (error, res) =>
  res.status(400).json({
    Succes: error.Success,
    Error: error.Error,
    Status: error.status,
    Message: error.message,
    Stack: error.stack,
  });

const errorProdMode = (error, res) =>
  res.status(404).json({
    Succes: error.Success,
    Error: error.Error,
    Status: error.status,
    Message: error.message,
  });

const globleError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  console.log(`mode: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "development") {
    erroDevMode(error, res);
  } else {
    errorProdMode(error, res);
  }
};

module.exports = globleError;

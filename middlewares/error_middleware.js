const globleError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
   
    res.status(400).json({
        Succes: error.Success,
        Error: error.Error,
        Status: error.status,
        Message: error.message,
        Stack: error.stack,
    });
};

module.exports = globleError;
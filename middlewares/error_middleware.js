const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

const globleError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
   
    console.log(`mode: ${process.env.NODE_ENV}`);
    process.env.NODE_ENV === 'development'?
        erroDevMode(error, res)
        :
        errorProdMode(error, res);
    
        
};

const erroDevMode = (error, res) => {
    return res.status(400).json({
        Succes: error.Success,
        Error: error.Error,
        Status: error.status,
        Message: error.message,
        Stack: error.stack,
    });
}

const errorProdMode = (error, res) => {
    return res.status(404).json({
        Succes: error.Success,
        Error: error.Error,
        Status: error.status,
        Message: error.message,
    
    });
}

module.exports = globleError;
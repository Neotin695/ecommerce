const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = express();
const dbConnection = require('./config/database_config');
const categoryRoute = require('./routes/category_route');
const ApiError = require('./utils/api_error');
const globleError = require('./middlewares/error_middleware');
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 8000;

dbConnection();


app.use(express.json());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


app.use('/api/v1/categories', categoryRoute);

app.all('*', (req, res, next) => {
   // const error = new Error(`con't find this route: ${req.originalUrl}`); 
    next(new ApiError(false,true,`con't find this route: ${req.originalUrl}`,400));
});

app.use(globleError);

const server = app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

process.on('unhandledRejection', (error) => {
    console.log(`UnhandledRejection: ${error.name} | ${error.message}`);
    server.close(() => {
        console.log('shutting down.....');
        process.exit(1);
    })
})


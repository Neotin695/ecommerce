const mongoose = require('mongoose');

const dbConnection = () =>mongoose.connect(process.env.DB_URL).then((connect) => {
    console.log(`database running host: ${connect.connection.host}`);
}).catch((error) => {
    console.error(`database error: ${error}`);
});

module.exports = dbConnection;
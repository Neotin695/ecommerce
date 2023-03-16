const mongoose = require("mongoose");

const dbConnection = () =>
  mongoose
    .connect("mongodb://127.0.0.1:27017")
    .then((connect) => {
      console.log(`database running host: ${connect.connection.host}`);
    })
    .catch((error) => {
      console.error(`database error: ${error}`);
    });

module.exports = dbConnection;

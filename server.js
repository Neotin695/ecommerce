const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();
const dbConnection = require("./config/databaseConfigure");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const ApiError = require("./utils/apiError");
const globleError = require("./middlewares/errorMiddleware");

dotenv.config({ path: "config.env" });

const PORT = 8000;

dbConnection();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.all("*", (req, res, next) => {
  next(
    new ApiError(false, true, `con't find this route: ${req.originalUrl}`, 400)
  );
});

app.use(globleError);

const server = app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`UnhandledRejection: ${error.name} | ${error.message}`);
  server.close(() => {
    console.log("shutting down.....");
    process.exit(1);
  });
});

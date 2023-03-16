const express = require("express");

const {
  createProduct,
  fetchAllProducts,
  fetchSpecificProduct,
  updateProduct,
  deleteProduct,
  uploadCategoryImage,
  resizeImage,
} = require("../services/productService");
const {
  createProductValidator,
  fetchOneProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadCategoryImage, resizeImage, createProductValidator, createProduct)
  .get(fetchAllProducts);

router
  .route("/:id")
  .put(uploadCategoryImage, resizeImage, updateProductValidator, updateProduct)
  .get(fetchOneProductValidator, fetchSpecificProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;

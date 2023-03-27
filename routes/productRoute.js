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

const { protectRoute, authorizationUser } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    createProductValidator,
    createProduct
  )
  .get(fetchAllProducts);

router
  .route("/:id")
  .put(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .get(fetchOneProductValidator, fetchSpecificProduct)
  .delete(
    protectRoute,
    authorizationUser("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;

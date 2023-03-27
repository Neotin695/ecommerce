const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  fetchAllBrand,
  fetchSpecificBrand,
  uploadCategoryImage,
  resizeImage,
} = require("../services/brandService");
const {
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  fetchOneBrandValidator,
} = require("../utils/validator/brandValidator");

const { authorizationUser, protectRoute } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(fetchAllBrand);

router
  .route("/:id")
  .get(fetchOneBrandValidator, fetchSpecificBrand)
  .delete(
    protectRoute,
    authorizationUser("admin"),
    deleteBrandValidator,
    deleteBrand
  )
  .put(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  );

module.exports = router;

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

const router = express.Router();

router
  .route("/")
  .post(uploadCategoryImage, resizeImage, createBrandValidator, createBrand)
  .get(fetchAllBrand);

router
  .route("/:id")
  .get(fetchOneBrandValidator, fetchSpecificBrand)
  .delete(deleteBrandValidator, deleteBrand)
  .put(uploadCategoryImage, resizeImage, updateBrandValidator, updateBrand);

module.exports = router;

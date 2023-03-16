const express = require("express");
const {
  createSubCategory,
  fetchAllSubCategories,
  fetchSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryId,
  createFilterCategory,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  fetchOneCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryId, createSubCategoryValidator, createSubCategory)
  .get(createFilterCategory, fetchAllSubCategories);

router
  .route("/:id")
  .get(fetchOneCategoryValidator, fetchSpecificSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory);

module.exports = router;

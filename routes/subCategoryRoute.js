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

const { protectRoute, authorizationUser } = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protectRoute,
    authorizationUser("admin"),
    setCategoryId,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterCategory, fetchAllSubCategories);

router
  .route("/:id")
  .get(fetchOneCategoryValidator, fetchSpecificSubCategory)
  .delete(
    protectRoute,
    authorizationUser("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  )
  .put(
    protectRoute,
    authorizationUser("admin"),
    updateSubCategoryValidator,
    updateSubCategory
  );

module.exports = router;

const express = require("express");

const subCategoryRoute = require("./subCategoryRoute");
const {
  fetchAllCategories,
  fetchSpecificCategory,
  createCategories,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");

const { authorizationUser, protectRoute } = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategories
  )
  .get(fetchAllCategories);
router
  .route("/:id")
  .get(getCategoryValidator, fetchSpecificCategory)
  .put(
    protectRoute,
    authorizationUser("admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protectRoute,
    authorizationUser("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;

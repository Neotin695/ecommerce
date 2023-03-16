const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const SubCategory = require("../../models/subCategoryModel");
const Category = require("../../models/categoryModel");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name required")

    .isLength({ min: 2 })
    .withMessage("to short subCategory name")
    .isLength({ max: 32 })
    .withMessage("to long subCategory name")
    .custom((subCategoryName) =>
      SubCategory.findOne({ name: subCategoryName }).then((subCategory) => {
        if (subCategory) {
          return Promise.reject(new Error(`subCategory already exists`));
        }
      })
    ),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`no category for this id: ${categoryId}`)
          );
        }
      })
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.fetchOneCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

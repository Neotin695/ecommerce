const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid id format "),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name required")
    .isLength({ min: 2 })
    .withMessage("to short category name")
    .isLength({ max: 32 })
    .withMessage("to long category name")
    .custom((categoryName) =>
      Category.findOne({ name: categoryName }).then((category) => {
        if (category) {
          return Promise.reject(new Error(`category already exsis`));
        }
        return true;
      })
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid id format "),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid id format "),
  validatorMiddleware,
];

const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const Subcategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product name required")
    .isLength({ min: 3 })
    .withMessage("too short product name")
    .isLength({ max: 100 })
    .withMessage("too long product name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("price")
    .notEmpty()
    .withMessage("product price required")
    .isNumeric()
    .withMessage("product price must be number")
    .toFloat()
    .isLength({ max: 20000 })
    .withMessage("too long product price"),
  check("priceAfterdescount")
    .optional()
    .isNumeric()
    .withMessage("price after descount must be number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        return Error("price after descount must lower than price");
      }
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description required")
    .isLength({ min: 20 })
    .withMessage("too short product description"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("sold must be number")
    .custom((value, { req }) => {
      if (req.body.quantity <= value) {
        return Error("sold must be lower than quantity or equals");
      }
      return true;
    }),
  check("quantity")
    .notEmpty()
    .withMessage("quantity required")
    .isNumeric()
    .withMessage("quantity must be number")
    .isLength({ min: 1 })
    .withMessage("minmum quantity is 1"),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be array of string"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of string"),
  check("imageCover").notEmpty().withMessage("image cover required"),
  check("category")
    .notEmpty()
    .withMessage("category required")
    .isMongoId()
    .withMessage("invalide id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`no category for this id:${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalide id format")
    .custom((subCategoryId) =>
      Subcategory.find({ _id: { $exists: true, $in: subCategoryId } }).then(
        (subCategory) => {
          if (subCategoryId.length !== subCategory.length) {
            return Promise.reject(new Error(`no subCategory for this ids`));
          }
        }
      )
    )
    .custom((subCategoriesId, { req }) =>
      Subcategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIds = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIds.push(subcategory._id.toString());
          });
          if (!subCategoriesId.every((e) => subcategoriesIds.includes(e))) {
            return Promise.reject(
              new Error("subcategories not belong to category")
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalide id format")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new Error(`no brand for this id: ${brandId}`));
        }
      })
    ),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("rating average must be number")
    .isLength({ min: 1 })
    .withMessage("rating average must be above 1.0 or equal")
    .isLength({ max: 5 })
    .withMessage("ratig average must be below 5.0 or equal"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("rating quantity must be number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalide id format"),
  check("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.fetchOneProductValidator = [
  check("id").isMongoId().withMessage("invalide id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalide id format"),
  validatorMiddleware,
];

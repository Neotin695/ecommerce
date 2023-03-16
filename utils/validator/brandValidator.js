const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Brand = require("../../models/brandModel");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name required")
    .isLength({ min: 2 })
    .withMessage("to short brand name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    })
    .isLength({ max: 32 })
    .withMessage("to long brand name")
    .custom((brandName) =>
      Brand.findOne({ name: brandName }).then((brand) => {
        if (brand) {
          return Promise.reject(new Error(`brand already exists`));
        }
      })
    ),
  validatorMiddleware,
];

exports.fetchOneBrandValidator = [
  check("id").isMongoId().withMessage("invalide brand id format"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalide brand id format "),
  check("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalide brand id format"),
  validatorMiddleware,
];

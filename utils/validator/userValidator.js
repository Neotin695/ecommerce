const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("too short name")
    .isLength({ max: 30 })
    .withMessage("too long name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalide email")
    .custom((email) =>
      UserModel.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exsits"));
        }
        return true;
      })
    ),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalide phone number"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("too short password")
    .isLength({ max: 20 })
    .withMessage("too long password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        return Promise.reject(new Error("password not match"));
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("too short name")
    .isLength({ max: 30 })
    .withMessage("too long name")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalide email"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalide phone number"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("too short password")
    .isLength({ max: 20 })
    .withMessage("too long password")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        return Promise.reject(new Error("password not match"));
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  validatorMiddleware,
];

exports.fetchSpecificValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  validatorMiddleware,
];

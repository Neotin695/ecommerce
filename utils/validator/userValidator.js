const slugify = require("slugify");
const { check } = require("express-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
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
          return Promise.reject(new Error("email already exists"));
        }
        return true;
      })
    ),
  check("profileImage").optional(),
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

    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        return Promise.reject(new Error("password not match"));
      }
      return true;
    })
    .custom((password, { req }) => {
      req.body.password = bcrypt.hash(password, 12);
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required")
    .custom(async (currentPassword, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("no user found");
      }
      const isCurrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCurrectPassword) {
        throw new Error("incorrect password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        return Promise.reject(new Error("confirm password not match"));
      }
      return true;
    }),
  check("password").notEmpty().withMessage("password is required"),
  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required")
    .custom(async (currentPassword, { req }) => {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        throw new Error("no user found");
      }
      const isCurrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCurrectPassword) {
        throw new Error("incorrect password");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        return Promise.reject(new Error("confirm password not match"));
      }
      return true;
    }),
  check("password").notEmpty().withMessage("password is required"),
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

exports.updateLoggedUserValidator = [
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
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalide phone number"),
  check("profilePhoto").optional(),
  validatorMiddleware,
];

exports.changeUserStatusValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  check("active").isBoolean().withMessage("value must be boolean only"),
  validatorMiddleware,
];

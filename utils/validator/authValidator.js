const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("too short name")
    .isLength({ max: 20 })
    .withMessage("too long name"),
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
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("too short password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        return Promise.reject(new Error("confirm password not match"));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.signinValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is requried")
    .isEmail()
    .withMessage("invalide email"),
  check("password")
    .notEmpty()
    .withMessage("password is requird")
    .isLength({ min: 8 })
    .withMessage("too short password"),
  validatorMiddleware,
];

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is requjired")
    .isEmail()
    .withMessage("invalide email"),
  validatorMiddleware,
];

exports.verifyResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("resetCode is required")
    .isLength({ min: 6 })
    .withMessage("invalide reset code")
    .isLength({ max: 6 })
    .withMessage("invalide reset code"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  check("password").notEmpty().withMessage("password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        return Promise.reject(new Error("confirm password not match"));
      }
      return true;
    }),
  validatorMiddleware,
];

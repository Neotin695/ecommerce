const express = require("express");

const {
  signupValidator,
  signinValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validator/authValidator");
const {
  signupUser,
  signinUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.route("/signup").post(signupValidator, signupUser);
router.route("/signin").post(signinValidator, signinUser);
router.route("/forgotPassword").post(forgotPasswordValidator, forgotPassword);
router
  .route("/verifyResetCode/:resetCode")
  .post(verifyResetCodeValidator, verifyResetCode);

router.route("/resetPassword/:id").post(resetPasswordValidator, resetPassword);
module.exports = router;

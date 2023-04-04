const crypto = require("crypto");

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("./handlerFactory");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/mail_utils");

exports.signupUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    email: req.body.email,
    password: req.body.password,
    active: true,
  });

  res.status(201).json({ data: user });
});

exports.signinUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  const password = await bcrypt.compare(req.body.password, user.password);
  if (!user || !password) {
    return next(new ApiError(false, true, "incorrect email or password", 400));
  }

  if (!user.active) {
    return next(new ApiError(false, true, "your account has been blocked!"));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        false,
        true,
        "you are not authenticated, please authenticate and try again",
        401
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(false, true, "user not found belong to this token")
    );
  }

  if (req.body.passwordChangeAt) {
    const dateTimestamp = parseInt(
      req.body.passwordChangeAt.getTime() / 1000,
      10
    );
    if (dateTimestamp > decoded.iat) {
      return next(
        new ApiError(
          false,
          true,
          "you changed password!, please authenticate and try again"
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

exports.authorizationUser = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          false,
          true,
          "you are not allowed to acess this route",
          403
        )
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(
        false,
        true,
        `no user for this email: ${req.body.email}`,
        404
      )
    );
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  user.verificationCode = hashCode;
  user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
  user.isCodeVerified = false;
  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "reset code message from e-shop",
      message: `the reset code valide for 10 minute \n ${verificationCode}`,
    });
    console.log(verificationCode);
    res.status(200).send("verification code sent sucessfully");
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    user.isCodeVerified = undefined;
    return next(new ApiError(false, true, `error to send email , ${err}`, 500));
  }
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.params;
  const verificationCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    verificationCode: verificationCode,
    verificationCodeExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ApiError(false, true, "the verificaton code invalide or exprired")
    );
  }
  if (!user.isCodeVerified) {
    user.isCodeVerified = true;

    await user.save();

    res.status(200).json({
      status: true,
      message: "verification code is verified sucessfully",
      resetPasswordLink: `${process.env.BASE_URL}/auth/resetPassword/${user._id}`,
    });
  } else {
    return next(new ApiError(false, true, "code already verified", 400));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);

  if (!user) {
    return next(new ApiError(false, true, `no user for this id: ${id}`, 404));
  }

  if (!user.isCodeVerified) {
    return next(new ApiError(false, true, "invalide verification", 400));
  }
  user.password = req.body.password;
  user.verifyResetCode = undefined;
  user.verificationCodeExpire = undefined;
  user.isCodeVerified = undefined;

  await user.save();

  res
    .status(200)
    .json({ status: true, message: "password has been changed sucessfully" });
});

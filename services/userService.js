const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { generateToken } = require("./handlerFactory");

exports.createUser = factory.createDocument(UserModel);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userModel = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      profilePhoto: req.body.profilePhoto,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!userModel) {
    return next(new ApiError(false, true, `no product for this id: ${id}`));
  }

  res.status(200).json({ data: userModel });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const userModel = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      password: req.body.password,
      passwordChangeAt: Date.now(),
    },
    { new: true }
  );
  if (!userModel) {
    return next(new ApiError(false, true, `no user for this id: ${id}`, 404));
  }

  res.status(200).json({ data: userModel });
});

exports.deleteUser = factory.deleteOneDocument(UserModel);

exports.fetchAllUsers = factory.fetchAllDocument(UserModel);

exports.fetchSpecificUser = factory.fetchSpecificDocument(UserModel);

exports.uploadProfileImage = uploadSingleImage("profileImage");

exports.resizeProfileImage = factory.resizeImage("users", "user", 600, 600);

exports.fetchLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: passwordHash,
      passwordChangeAt: Date.now(),
    },
    { new: true }
  );

  const token = generateToken(req.user._id);
  res
    .status(200)
    .json({ data: user, message: "password changed sucessfully", token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const userModel = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      profilePhoto: req.body.profilePhoto,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: userModel });
});

exports.changeUserStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    id,
    { active: req.body.active },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(false, true, `no user for this id: ${id}`));
  }

  res.status(204).json({ status: "sucess" });
});

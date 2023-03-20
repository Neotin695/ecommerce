const UserModel = require("../models/userModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.createUser = factory.createDocument(UserModel);

exports.updateUser = factory.updateDocument(UserModel);

exports.deleteUser = factory.deleteOneDocument(UserModel);

exports.fetchAllUsers = factory.fetchAllDocument(UserModel);

exports.fetchSpecificUser = factory.fetchSpecificDocument(UserModel);

exports.uploadProfileImage = uploadSingleImage("profileImage");

exports.resizeProfileImage = factory.resizeImage("users", "user", 600, 600);

const express = require("express");

const {
  createUser,
  updateUser,
  deleteUser,
  fetchAllUsers,
  fetchSpecificUser,
  uploadProfileImage,
  resizeProfileImage,
} = require("../services/userService");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  fetchSpecificValidator,
} = require("../utils/validator/userValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadProfileImage, resizeProfileImage, createUserValidator, createUser)
  .get(fetchAllUsers);

router
  .route("/:id")
  .put(uploadProfileImage, resizeProfileImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser)
  .get(fetchSpecificValidator, fetchSpecificUser);

module.exports = router;

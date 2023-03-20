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

const router = express.Router();

router
  .route("/")
  .post(uploadProfileImage, resizeProfileImage, createUser)
  .get(fetchAllUsers);

router
  .route("/:id")
  .put(uploadProfileImage, resizeProfileImage, updateUser)
  .delete(deleteUser)
  .get(fetchSpecificUser);

module.exports = router;

const express = require("express");

const {
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  fetchAllUsers,
  fetchSpecificUser,
  uploadProfileImage,
  resizeProfileImage,
  fetchLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  changeUserStatus,
} = require("../services/userService");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  fetchSpecificValidator,
  changePasswordValidator,
  updatePasswordValidator,
  updateLoggedUserValidator,
  changeUserStatusValidator,
} = require("../utils/validator/userValidator");

const { protectRoute, authorizationUser } = require("../services/authService");

const router = express.Router();

router.route("/getMe").get(protectRoute, fetchLoggedUser, fetchSpecificUser);
router
  .route("/updatePassword")
  .put(protectRoute, updatePasswordValidator, updateLoggedUserPassword);
router
  .route("/updateData")
  .put(protectRoute, updateLoggedUserValidator, updateLoggedUserData);

router.use(protectRoute, authorizationUser("admin"));
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router
  .route("/")
  .post(uploadProfileImage, resizeProfileImage, createUserValidator, createUser)
  .get(fetchAllUsers);

router
  .route("/changeUserStatus/:id")
  .put(changeUserStatusValidator, changeUserStatus);

router
  .route("/:id")
  .put(uploadProfileImage, resizeProfileImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser)
  .get(fetchSpecificValidator, fetchSpecificUser);

module.exports = router;

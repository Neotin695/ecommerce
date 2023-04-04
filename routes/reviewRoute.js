const express = require("express");

const {
  createReview,
  updateReview,
  deleteReview,
  fetchAllReview,
  fetchSpecificReview,
} = require("../services/reviewService");

const { protectRoute, authorizationUser } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(protectRoute, authorizationUser("user"), createReview)
  .get(protectRoute, fetchAllReview);

router
  .route("/:id")
  .put(protectRoute, authorizationUser("user"), updateReview)
  .get(protectRoute, authorizationUser("admin"), fetchSpecificReview)
  .delete(protectRoute, authorizationUser("user", "admin"), deleteReview);

module.exports = router;

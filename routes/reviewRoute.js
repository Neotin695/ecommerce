const express = require("express"); 

const {
  createReviewValidator,
  updateReviewValidator,
  fetchSpecificReviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/reviewValidator");

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
  .post(
    protectRoute,
    authorizationUser("user"),
    createReviewValidator,
    createReview
  )
  .get(protectRoute, fetchAllReview);

router
  .route("/:id")
  .put(
    protectRoute,
    authorizationUser("user"),
    updateReviewValidator,
    updateReview
  )
  .get(
    protectRoute,
    authorizationUser("admin"),
    fetchSpecificReviewValidator,
    fetchSpecificReview
  )
  .delete(
    protectRoute,
    authorizationUser("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;

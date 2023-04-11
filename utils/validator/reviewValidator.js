const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("description").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat()
    .isLength({ min: 1 })
    .withMessage("rating must be above 1 or equal")
    .isLength({ max: 5 })
    .withMessage("rating must be below 5 or equal"),
  check("user")
    .notEmpty()
    .withMessage("review must be belong to user")
    .isMongoId()
    .withMessage("invalide user id"),
  check("product")
    .notEmpty()
    .withMessage("review must be belong to product")
    .isMongoId()
    .withMessage("invalide product id")
    .custom((product, { req }) => {
      Review.findOne({ user: req.user, product }).then((review) => {
        if (review) {
          return Promise.reject(new Error("you already reviewed this product"));
        }
        return true;
      });
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalide id")
    .custom((id, { req }) => {
      Review.findById(id).then((review) => {
        if (!review) {
          return Promise.reject(new Error("review not found"));
        }
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error("you are not allowed to perform"));
        }
        return true;
      });
    }),
  check("description").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat()
    .isLength({ min: 1 })
    .withMessage("rating must be above 1 or equal")
    .isLength({ max: 5 })
    .withMessage("rating must be below 5 or equal"),
  validatorMiddleware,
];

exports.fetchSpecificReviewValidator = [
  check("id").isMongoId().withMessage("invalide id"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalide id")
    .custom((id, { req }) => {
      Review.findById(id).then((review) => {
        if (!review) {
          return Promise.reject(new Error("review not found"));
        }
        if (
          review.user.toString() !== req.user._id.toString() &&
          req.user.role === "user"
        ) {
          return Promise.reject(new Error("you are not allowed to perform"));
        }
        return true;
      });
    }),
  validatorMiddleware,
];

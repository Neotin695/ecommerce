const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema(
  {
    description: {
      type: String,
      minlength: [20, "too short description"],
      maxlength: [200, "too long description"],
      trim: true,
    },
    ratings: {
      type: Number,
      min: [1, "the rating must be above 1 or equal"],
      max: [5, "the rating must be below 5 or equal"],
      required: [true, " rating required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "the review must be belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "products",
      required: [true, "the review must be belong to product"],
    },
  },
  { timestamps: true }
);

reviewModel.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

module.exports = mongoose.model("reviews", reviewModel);

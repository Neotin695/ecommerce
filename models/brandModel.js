const mongoose = require("mongoose");

const brandModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "brand name must be unique"],
      required: [true, "brand name required"],
      minlength: [2, "to short brand name"],
      maxlength: [32, "to long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("brands", brandModelSchema);

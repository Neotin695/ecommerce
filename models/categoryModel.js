const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category name required"],
      unique: [true, "category must be unique"],
      minlength: [3, "too short category name"],
      maxlength: [32, "too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categoriesSchema.post("init", (doc) => {
  setImageUrl(doc);
});
categoriesSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("categories", categoriesSchema);

const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: {
      type: String,
      trime: true,
      required: [true, "product title required"],
      minlength: [3, "to short product title"],
      maxlength: [100, "to long product name"],
    },
    price: {
      type: Number,
      required: [true, "product price required"],
      max: [200000, "too long product price"],
    },
    priceAfterDescount: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, "description required"],
      minlength: [20, "too short description"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity required"],
      min: [1, "quantity must be above or equal 1"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "image cover required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
      required: [true, "category required"],
    },
    subcategories: {
      type: [mongoose.Schema.ObjectId],
      ref: "subCategories",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brands",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "rating must be graterthan or equal 1.0"],
      max: [5, "rating must be lessthan or equal 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    const tempImages = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      tempImages.push(imageUrl);
    });
    doc.images = tempImages;
  }
};

productModel.post("init", (doc) => {
  setImageUrl(doc);
});
productModel.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("products", productModel);

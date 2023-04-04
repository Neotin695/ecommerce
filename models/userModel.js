const mongoose = require("mongoose");

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      minlength: [11, "invalide phone number"],
      maxlength: [11, "invalide phone number"],
    },
    profileImage: String,
    email: {
      type: String,
      trim: true,
      validate: [isEmail, "invalide email"],
      unique: true,
      lowercase: true,
      required: [true, "email required"],
    },
    verificationCode: String,
    verificationCodeExpire: Date,
    isCodeVerified: Boolean,
    password: {
      type: String,
      trim: true,
      required: [true, "password required"],
      minlength: [8, "too short password"],
    },
    active: {
      type: Boolean,
      defualt:true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const setImage = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};

userModel.post("init", (doc) => {
  setImage(doc);
});
userModel.post("save", (doc) => {
  setImage(doc);
});

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = (await bcrypt.hash(this.password, 12));
  next();
});

module.exports = mongoose.model("users", userModel);

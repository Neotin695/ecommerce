const multer = require("multer");

const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  const multerStorageBuffer = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new ApiError(false, true, "only image allowed", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorageBuffer,
    fileFilter: multerFilter,
  });

  return upload.single(fieldName);
};

exports.uploadMixOfImages = () => {
  const multerStorageBuffer = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new ApiError(false, true, "only image allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorageBuffer,
    fileFilter: multerFilter,
  });
  return upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]);
};

const asyncHandler = require("express-async-handler");
const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const ApiFuture = require("../utils/apiFuture");

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

exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const documents = await Model.create(req.body);
    res.status(201).json({ data: documents });
  });

exports.resizeImage = (folderNmae, startName) =>
  asyncHandler(async (req, res, next) => {
    const filePath = `${folderNmae}/${startName}-${uuidv4()}${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/${filePath}`);

    req.body.image = filePath;
    next();
  });

exports.uploadImage = (fieldName) => upload.single(fieldName);

exports.fetchSpecificDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findById(id);
    if (!documents) {
      return next(new ApiError(false, true, `no product for this id: ${id}`));
    }

    res.status(200).json({ data: documents });
  });

exports.fetchAllDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const documentCounts = await Model.countDocuments();
    const { mongooseQuery, pagiationResult } = new ApiFuture(
      Model.find(),
      req.query
    )
      .filter()
      .sort()
      .paginate(documentCounts)
      .fields()
      .search();
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, pagiationResult, data: documents });
  });

exports.updateDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!documents) {
      return next(new ApiError(false, true, `no product for this id: ${id}`));
    }

    res.status(200).json({ data: documents });
  });

exports.deleteOneDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndDelete(id);
    if (!documents) {
      return next(new ApiError(false, true, `no product for this id: ${id}`));
    }

    res.status(200).json({ message: "product deleted successfully" });
  });

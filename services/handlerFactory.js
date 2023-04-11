const asyncHandler = require("express-async-handler");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const ApiFuture = require("../utils/apiFuture");

exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const documents = await Model.create(req.body);
    res.status(201).json({ data: documents });
  });

exports.generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });

exports.updateDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!documents) {
      return next(new ApiError(false, true, `no document for this id: ${id}`));
    }

    res.status(200).json({ data: documents });
  });

exports.deleteOneDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndDelete(id);
    if (!documents) {
      return next(new ApiError(false, true, `no document for this id: ${id}`));
    }

    res.status(200).json({ message: "deleted successfully" });
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

exports.fetchSpecificDocument = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = await Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError(false, true, `no document for this id: ${id}`));
    }

    res.status(200).json({ data: document });
  });

exports.resizeImage = (folderName, modelName, width, height) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filePath = `${modelName}-${uuidv4()}${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(width, height)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/${folderName}/${filePath}`);

      if (modelName === "user") {
        req.body.profileImage = filePath;
      } else if (modelName === "product") {
        req.body.imageCover = filePath;
      } else {
        req.body.image = filePath;
      }
    }
    next();
  });

exports.resizeProductImages = () =>
  asyncHandler(async (req, res, next) => {
    this.resizeImage("products", "product", 600, 600);
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(
          asyncHandler(async (img, index) => {
            const filePath = `product-${uuidv4()}${Date.now()}-${index}.jpeg`;
            await sharp(img.buffer)
              .resize(1280, 1280)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(`uploads/products/${filePath}`);

            req.body.images.push(filePath);
          })
        )
      );
      next();
    }
  });

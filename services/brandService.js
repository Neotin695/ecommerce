const BrandModel = require("../models/brandModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.createBrand = factory.createDocument(BrandModel);

exports.updateBrand = factory.updateDocument(BrandModel);

exports.deleteBrand = factory.deleteOneDocument(BrandModel);

exports.fetchAllBrand = factory.fetchAllDocument(BrandModel);

exports.fetchSpecificBrand = factory.fetchSpecificDocument(BrandModel);

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = factory.resizeImage("brands", "brand", 600, 600);

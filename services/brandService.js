const BrandModel = require("../models/brandModel");
const factory = require("./handlerFactory");

exports.createBrand = factory.createDocument(BrandModel);

exports.uploadCategoryImage = factory.uploadImage("image");

exports.resizeImage = factory.resizeImage("brands", "brand");

exports.fetchAllBrand = factory.fetchAllDocument(BrandModel);

exports.fetchSpecificBrand = factory.fetchSpecificDocument(BrandModel);

exports.deleteBrand = factory.deleteOneDocument(BrandModel);

exports.updateBrand = factory.updateDocument(BrandModel);

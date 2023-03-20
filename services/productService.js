const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.createProduct = factory.createDocument(ProductModel);

exports.updateProduct = factory.updateDocument(ProductModel);

exports.deleteProduct = factory.deleteOneDocument(ProductModel);

exports.fetchAllProducts = factory.fetchAllDocument(ProductModel);

exports.fetchSpecificProduct = factory.fetchSpecificDocument(ProductModel);

exports.uploadCategoryImage = uploadMixOfImages();

exports.resizeImage = factory.resizeProductImages();

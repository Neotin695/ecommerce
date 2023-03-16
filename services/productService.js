const ProductModel = require("../models/productModel");
const factory = require("./handlerFactory");

exports.createProduct = factory.createDocument(ProductModel);

exports.uploadCategoryImage = factory.uploadImage("imageCover");

exports.resizeImage = factory.resizeImage("products", "product");

exports.updateProduct = factory.updateDocument(ProductModel);

exports.fetchSpecificProduct = factory.fetchSpecificDocument(ProductModel);

exports.fetchAllProducts = factory.fetchAllDocument(ProductModel);

exports.deleteProduct = factory.deleteOneDocument(ProductModel);

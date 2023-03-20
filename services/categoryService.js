const CategoryModel = require("../models/categoryModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.createCategories = factory.createDocument(CategoryModel);

exports.updateCategory = factory.updateDocument(CategoryModel);

exports.deleteCategory = factory.deleteOneDocument(CategoryModel);

exports.fetchAllCategories = factory.fetchAllDocument(CategoryModel);

exports.fetchSpecificCategory = factory.fetchSpecificDocument(CategoryModel);

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = factory.resizeImage("categories", "category", 600, 600);

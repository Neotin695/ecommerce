const CategoryModel = require("../models/categoryModel");
const factory = require("./handlerFactory");

exports.uploadCategoryImage = factory.uploadImage("image");

exports.resizeImage = factory.resizeImage("categories", "category");

exports.fetchAllCategories = factory.fetchAllDocument(CategoryModel);

exports.fetchSpecificCategory = factory.fetchSpecificDocument(CategoryModel);

exports.createCategories = factory.createDocument(CategoryModel);

exports.deleteCategory = factory.deleteOneDocument(CategoryModel);

exports.updateCategory = factory.updateDocument(CategoryModel);

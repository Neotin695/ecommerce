const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = factory.createDocument(SubCategoryModel);

exports.createFilterCategory = (req, res, next) => {
  let filterCategory = {};
  if (req.params.categoryId)
    filterCategory = { category: req.params.categoryId };
  req.filterCategory = filterCategory;
  next();
};

exports.fetchAllSubCategories = factory.fetchAllDocument(SubCategoryModel);

exports.fetchSpecificSubCategory =
  factory.fetchSpecificDocument(SubCategoryModel);

exports.updateSubCategory = factory.updateDocument(SubCategoryModel);

exports.deleteSubCategory = factory.deleteOneDocument(SubCategoryModel);

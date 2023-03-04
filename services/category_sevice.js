const CategoryModel = require('../models/category_model');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ApiError = require('../utils/api_error');

exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({}).skip(skip).limit(limit);
    res.status(200).json({results: categories.length, data: categories})
});

exports.getCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
        return next(ApiError(false, true, `No category for this id ${id}`, 404));
    } 
    
    res.status(200).json({ data: category });
});

exports.createCategories = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const categories = await CategoryModel.create({ name, slug: slugify(name) });

    res.status(201).json({ data: categories });
});

exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
        return next(ApiError(false, true,  `No category for this id ${id}`, 404));
    }
    res.status(204).json({ message: 'category Deleted Successfully'});
});

exports.updateCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.params;

    const category = await CategoryModel.findOneAndUpdate({ _id: id }, { name }, { new: true });

    if (!category) { 
        return next(ApiError(false, true, `No category for this id ${id}`, 404));
    }

    res.status(200).json({ data: category });
});
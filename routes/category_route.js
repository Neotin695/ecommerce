const express = require('express');
const { getCategories,getCategory,createCategories, updateCategory ,deleteCategory} = require('../services/category_sevice');

const router = express.Router();

router.route('/').get(getCategories).post(createCategories);
router.route('/:id').get(getCategory);
router.route('/:id/:name').put(updateCategory);
router.route('/:id').delete(deleteCategory);

module.exports = router;


const express = require('express');
const { getCategories,getCategory,createCategories, updateCategory ,deleteCategory} = require('../services/category_sevice');
const { param, validationResult } = require('express-validator');
const router = express.Router();

router.route('/').get(getCategories).post(createCategories);
router.route('/:id').get(
    param('id').isMongoId().withMessage('invalid id'),
    (req, resizeBy) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resizeBy.status(400).json({ errors: errors.array() });
        }
    },
    getCategory).put(updateCategory).delete(deleteCategory);


module.exports = router;


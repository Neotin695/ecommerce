const ReviewModel = require("../models/reviewModel");
const factory = require("./handlerFactory");

exports.createReview = factory.createDocument(ReviewModel);

exports.updateReview = factory.updateDocument(ReviewModel);

exports.deleteReview = factory.deleteOneDocument(ReviewModel);

exports.fetchAllReview = factory.fetchAllDocument(ReviewModel);

exports.fetchSpecificReview = factory.fetchSpecificDocument(ReviewModel);

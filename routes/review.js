const express= require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("C:/MajorProject/utils/wrapAsync.js");
const Review = require("C:/MajorProject/models/review.js");
const Listing = require("C:/MajorProject/models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("C:/MajorProject/middleware.js");
const reviewController = require("C:/MajorProject/controllers/review.js")

//Post Route
router.post(
    "/", 
    isLoggedIn,
    validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete(
    "/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;
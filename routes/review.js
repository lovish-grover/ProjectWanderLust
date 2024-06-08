const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../util/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor, validatReview} = require("../middleware.js")

const reviewController = require("../controller/review.js");


router.post("/",isLoggedIn, validatReview, wrapAsync(reviewController.createReview));


router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.distroyReview));

module.exports = router;
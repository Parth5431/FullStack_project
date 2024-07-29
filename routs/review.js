const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../scheema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedin, isAuthor } = require("../middleware.js");
const reviewcontroller = require("../controller/review.js")


//reviews post route
router.post("/",  isLoggedin, validateReview,wrapAsync(reviewcontroller.createReview));

//review delete route
router.delete("/:reviewId", isAuthor, wrapAsync(reviewcontroller.destroyReview));
    
module.exports = router;
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./util/ExpressError.js");
const { reviewSchema, listingSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be looged in to create listing");
        res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curUser._id)){
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    console.log(reviewId);
    let review = await Review.findById(reviewId);
    console.log(review);
    if (!review.author.equals(res.locals.curUser._id)){
    req.flash("error", "You are not the owner of this review");
    return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validatReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
module.exports.validationListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
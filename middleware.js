const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./scheema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedin = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/login");
     }
        next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next(); 
};

module.exports.isOwner = async(req, res, next)=>{
   let {id} = req.params;
   let listing =  await Listing.findById(id);
if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error","You does not have access for this");
    return res.redirect(`/listing/${id}`);
}
next();
};
module.exports.validate = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
     if(error){
         let errMsg = error.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errMsg);
     }else{
        next();
     }
  };

  module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
     if(error){
         let errMsg = error.details.map((el)=> el.message).join(",");
         throw new ExpressError(400, errMsg);
     }else{
        next();
     }
  };
  module.exports.isAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review =  await Review.findById(reviewId);
 if (!review.author._id.equals(res.locals.currentUser._id)) {
     req.flash("error","You does not have access for this");
     return res.redirect(`/listing/${id}`);
 }
 next();
 };
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedin,isOwner,validate } = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});  

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post( isLoggedin,
    upload.single("listing[image]"),
    validate,
     wrapAsync(listingcontroller.createListing));


 //Adding New Place
 router.get("/new",isLoggedin, listingcontroller.RenderNewform);
 
router.route("/:id")
.get( wrapAsync(listingcontroller.showListing))
.put(isLoggedin,isOwner,upload.single("listing[image]"),validate,(listingcontroller.updateListing))
// .put(    ),(req,res)=>{
//     res.send(req.file)
//})
.delete(isLoggedin, isOwner, wrapAsync(listingcontroller.destroyListing));



 
 //update route
 router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingcontroller.editListing));

 module.exports = router;
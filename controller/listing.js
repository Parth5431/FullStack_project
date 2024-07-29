const Listing = require("../models/listing");
const mbxGiocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGiocoding({ accessToken: process.env.MAP_TOKEN });



module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.RenderNewform = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
         path:"author"},
      })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you are requesting not exist");
      res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
 };

 module.exports.createListing = async (req, res, next) => {
   let responce = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
  
    let url = req.file.path;
    let filename = req.file.filename; 
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry =  responce.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
 };

module.exports.editListing= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you are requesting not exist");
      res.redirect("/listing");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listing/edit.ejs", { listing, originalUrl });
 }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename; 
      listing.image = {url, filename};
      await listing.save();  
    }
    req.flash("success","Listing Updated successfully");
    res.redirect(`/listing/${id}`);
 }

 module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted  successfully");
    res.redirect("/listing");
 }
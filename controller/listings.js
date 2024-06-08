const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", {AllListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListings = async (req,res)=> {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    // res.send("done!");


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features [0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "new listings created!");
    res.redirect("/listings");
    
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let orgUrl = listing.image.url;
    orgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, orgUrl});
}

module.exports.distroyListings = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(dele)
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.updateListings = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image= {url, filename}; 
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}
const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../util/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validationListing} = require("../middleware.js");
const listingController = require("../controller/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validationListing, wrapAsync (listingController.createListings))

router.get("/new", isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.put( isLoggedIn,isOwner, upload.single("listing[image]"), validationListing, wrapAsync(listingController.updateListings))
.delete(isOwner, wrapAsync(listingController.distroyListings))
.get( wrapAsync(listingController.showListings));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router; 
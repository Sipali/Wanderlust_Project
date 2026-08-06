const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });




// format using router.route
router.route("/")
// index route
.get(wrapAsync(listingController.index))
// create post
.post(
isLoggedIn,
upload.single('listing[image]'),
validateListing,
// ye  uploa line mean ye multer ek file parse kr ke upload kr rha h or vo data req.file me jati h 
wrapAsync(listingController.createListing)
);


// create new post form render
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
// show route
.get(wrapAsync(listingController.showListing))
// update  route
.put(isLoggedIn,isOwner,
    upload.single('listing[image]'),
    validateListing, wrapAsync(listingController.updateListing))
// delete route
.delete(isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));




// edit route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
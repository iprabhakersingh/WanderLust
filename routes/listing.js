const express= require("express");
const router = express.Router();
const wrapAsync = require("C:/MajorProject/utils/wrapAsync.js");
const Listing = require("C:/MajorProject/models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("C:/MajorProject/middleware.js");
const listingController = require("C:/MajorProject/controllers/listing.js");
const multer = require("multer");
const {storage} = require("C:/MajorProject/cloudconfig");
const upload = multer({storage});

router.route("/") 
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

//New route 
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/filter/:category", wrapAsync(listingController.fiterIndex));
router.get("/search", wrapAsync(listingController.searchIndex));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete( 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

//Edit route
router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));
 
module.exports = router;
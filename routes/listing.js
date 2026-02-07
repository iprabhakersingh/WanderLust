const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig");
const upload = multer({storage});

router.route("/") 
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

router.get("/ai-search", wrapAsync(listingController.aiSearch));

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

router.post(
    "/ai/improve-description",
    isLoggedIn,
    listingController.aiImproveDescription
);

router.post(
  "/ai/suggest-price",
  isLoggedIn,
  listingController.aiSuggestPrice
);
 
module.exports = router;

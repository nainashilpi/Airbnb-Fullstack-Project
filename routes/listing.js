const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const User = require("../models/user.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/favourites", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favourites");
  res.render("listings/favourites.ejs", { listings: user.favourites });
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

router.get("/terms", (req, res) => {
  res.render("terms");
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

router.post("/:id/like", isLoggedIn, async (req, res) => {
  const listingId = req.params.id;
  const user = await User.findById(req.user._id);

  const alreadyLiked = user.favourites.includes(listingId);

  if (alreadyLiked) {
    user.favourites.pull(listingId);
  } else {
    user.favourites.push(listingId);
  }

  await user.save();
  res.json({ liked: !alreadyLiked });
});

router.post("/:id/remove-favourite", isLoggedIn, async (req, res) => {
  const listingId = req.params.id;
  const user = await User.findById(req.user._id);

  user.favourites.pull(listingId);
  await user.save();

  res.redirect("/listings/favourites");
});

module.exports = router;

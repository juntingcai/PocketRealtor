var express = require('express');
var router = express.Router();

const Listing = require("../controllers/listingController");
const User = require("../controllers/userController")

router.post('/listing/create', User.verifyToken, Listing.verifyHostRole, Listing.createListing);
router.get('/listings', Listing.findRentListings);
router.get('/listing/:id', Listing.getListingById);
router.put('/listing/duplicate/:id', User.verifyToken, Listing.verifyHostRole, Listing.copyFromListing);
router.put('/listing/update', User.verifyToken, Listing.verifyHostRole, Listing.updateListing)

router.delete('/listing/delete/:id', User.verifyToken, Listing.verifyHostRole, Listing.deleteListing)
module.exports = router;

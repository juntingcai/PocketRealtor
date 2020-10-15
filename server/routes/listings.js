var express = require('express');
var router = express.Router();

const Listing = require("../controllers/listingController");
const User = require("../controllers/userController")

router.post('/listing/create', User.verifyToken, Listing.verifyHostRole, Listing.createListing);
router.get('/listings', Listing.findRentListings);
router.delete('/listing/delete/:id', User.verifyToken, Listing.verifyHostRole, Listing.deleteListing)
module.exports = router;

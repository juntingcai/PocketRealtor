const resTemplate = require("../static/ResponseTemplate");

const User = require("../models/userModel");
const UserRole = require("../models/roleModel");
const RoleType = require("../static/RoleType");
const ListingModel = require("../models/listingModel");

// {
//    id : 1 ,
//    title : "My Elegant house",
//    introduction : "A good house",
//    address : "2312 Cool Stree.",
//    city : "San Francisco",
//    state : "CA",
//    zip_code : 94118,
//    latitude : 23.232456,
//    longitude : 123.123456,
//    price : 1331234,
//    rooms : 5,
//    image_links : null,
// }

class ListingController {
  findListings(req, res, next) {
    let state = req.query.state;
    let city = req.query.city;
    let zipCode = req.query.zipcode;
    let minPrice = req.query.minprice;
    let maxPrice = req.query.maxprice;

    let searchResult = [];
    ListingModel.findAllListing().then((listings) => {
      for (var i = 0; i < listings.length; i++) {
        let listing = listings[i];
        if (state && state != listing.state) {
          continue;
        }

        if (city && city != listing.city) {
          continue;
        }

        if (zipCode && zipCode != listing.zip_code) {
          continue;
        }

        if (listing.price) {
          let price = parseFloat(listing.price);
          if (minPrice && price < minPrice) {
            continue;
          }

          if (maxPrice && price > maxPrice) {
            continue;
          }
        }

        searchResult.push(listing);
      }
      res.json(searchResult);
    });
  }

  createListing(req, res, next) {
    let property = req.body.property;
    property.owner_id = req.body.user.id;
    ListingModel.createListing(property).then((listing) => {
      res.json(listing);
    });
  }

  copyFromListing(req, res, next){
    // TODO
  }

  deleteListing(req, res, next) {
    let userId = req.body.user.id;
    let listingId = req.params.id;

    ListingModel.findListingById(listingId).then((listing) => {
      if (listing) {
        if (listing.owner_id != userId) {
          res.json(resTemplate.PERMISSION_DENY);
        } else {
          ListingModel.deleteListing(listingId);
          res.json(resTemplate.SUCCESS);
        }
      } else {
        res.json(resTemplate.NO_DATA);
      }
    });

    ListingModel.findListingById;
  }

  verifyHostRole(req, res, next) {
    let user = req.body.user;
    let userId = user.id;

    UserRole.getUserRole(userId).then((roles) => {
      var isUserHost = false;
      for (var i = 0; i < roles.length; i++) {
        let role = roles[i];
        console.log(role);
        if (role.role_id === RoleType.HOST.id) {
          isUserHost = true;
          break;
        }
      }
      if (isUserHost) {
        next();
      } else {
        res.json(resTemplate.PERMISSION_DENY);
      }
    });
  }
}

module.exports = new ListingController();

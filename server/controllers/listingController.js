const resTemplate = require("../static/ResponseTemplate");

const User = require("../models/userModel");
const UserRole = require("../models/roleModel");
const RoleType = require("../static/RoleType");
const ListingModel = require("../models/listingModel");

class ListingController {
  findRentListings(req, res, next) {
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

        if (listing.rent_price) {
          let price = parseFloat(listing.rent_price);
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

  getListingById(req, res, next) {
    let listingId = req.params.id;
    ListingModel.findListingById(listingId).then((listing) => {
      if (listing) {
        res.json(listing);
      } else {
        res.json(resTemplate.NO_DATA);
      }
    });
  }

  createListing(req, res, next) {
    let property = req.body.property;
    property.owner_id = req.body.user.id;
    ListingModel.createListing(property).then((listing) => {
      res.json(listing);
    });
  }

  copyFromListing(req, res, next) {
    let user = req.body.user;
    let listingId = req.params.id;
    ListingModel.findListingById(listingId).then((listing) => {
      if (!listing) {
        res.json(resTemplate.NO_DATA);
        return;
      }

      let replicatedListing = {
        title: listing.get("title"),
        description: listing.get("description"),
        address: listing.get("address"),
        city: listing.get("city"),
        state: listing.get("state"),
        latitude: listing.get("latitude"),
        longitude: listing.get("longitude"),
        rooms: listing.get("rooms"),
        zip_code: listing.get("zip_code"),
        rent_price: listing.get("rent_price"),
        sale_price: listing.get("sale_price"),
        bath_rooms: listing.get("bath_rooms"),
        area: listing.get("area"),
        age: listing.get("age"),
        owner_id: user.id,
      };
      console.log(replicatedListing);

      ListingModel.createListing(replicatedListing).then((newListing) => {
        if (newListing) {
          res.json(newListing);
        } else {
          res.json(resTemplate.FAIL);
        }
      });
    });
  }

  updateListing(req, res, next) {
    let userId = req.body.user.id;
    let properties = req.body.property;
    let listingId = req.body.id;
    if (!listingId || !properties) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }
    ListingModel.findListingById(listingId).then((listing) => {
      if (listing) {
        if (listing.owner_id != userId) {
          res.json(resTemplate.PERMISSION_DENY);
        } else {
          ListingModel.deleteListing(listingId).then(() => {
            properties.id = listingId;
            properties.owner_id = listing.owner_id;
            ListingModel.createListing(properties).then((newListing) => {
              res.json(newListing);
            });
          });
        }
      } else {
        res.json(resTemplate.NO_DATA);
      }
    });

    ListingModel.findListingById;
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

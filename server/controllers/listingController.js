const resTemplate = require("../static/ResponseTemplate");
const RoleType = require("../static/RoleType");
const UserService = require("../services/UserService");
const ListingService = require("../services/ListingService");
const HistoryService = require("../services/HistoryService");

class ListingController {
  findListings(req, res, next) {
    if (
      !req.query.lat ||
      !req.query.lng ||
      !req.query.radius ||
      !req.query.type
    ) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }
    let latitude = parseFloat(req.query.lat);
    let longitude = parseFloat(req.query.lng);
    let radius = parseFloat(req.query.radius);
    let type = parseInt(req.query.type);

    let condition = {
      latitude: latitude,
      longitude: longitude,
      radius: radius,
    };
    if (req.query.minPrice) {
      condition.minPrice = req.query.minPrice;
    }
    if (req.query.maxPrice) {
      condition.maxPrice = req.query.maxPrice;
    }
    if (req.query.bedrooms) {
      condition.bedrooms = req.query.bedrooms;
    }
    if (req.query.bathrooms) {
      condition.bathrooms = req.query.bathrooms;
    }
    if (type == 1) {
      ListingService.findRentListings(condition, res);
    } else if (type == 2) {
      ListingService.findRentListings(condition, res);
    } else {
      res.json(resTemplate.NO_DATA);
    }
  }

  getListingById(req, res, next) {
    let listingId = req.params.id;
    if (listingId) {
      ListingService.getListingById(listingId).then((listing) => {
        if (listing) {
          res.json(listing);
          if (req.body.user) {
            HistoryService.viewListing(req.body.user.id, listingId);
          }
        } else {
          res.status(404).json(resTemplate.NO_DATA);
        }
      });
    }
  }

  createListing(req, res, next) {
    let property = req.body.property;
    if (property) {
      ListingService.createListing(req.body.user.id, property, res);
    } else {
      res.status(400);
    }
  }

  copyFromListing(req, res, next) {
    let user = req.body.user;
    let listingId = req.params.id;
    if (listingId) {
      ListingService.duplicateListing(user.id, listingId, res);
    } else {
      res.json(resTemplate.MISS_FIELD);
    }
  }

  updateListing(req, res, next) {
    let userId = req.body.user.id;
    let properties = req.body.property;
    let listingId = req.body.id;
    if (!listingId || !properties) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }
    ListingService.updateListing(userId, listingId, properties, res);
  }

  deleteListing(req, res, next) {
    let userId = req.body.user.id;
    let listingId = req.params.id;
    if (!listingId) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }
    ListingService.deleteListing(userId, listingId, res);
  }

  verifyHostRole(req, res, next) {
    let user = req.body.user;
    let userId = user.id;
    if (!user) {
      res.status(403);
    }
    UserService.checkUserRole(userId, RoleType.HOST.id).then((result) => {
      if (result) {
        next();
      } else {
        res.json(resTemplate.PERMISSION_DENY);
      }
    });
  }
}

module.exports = new ListingController();

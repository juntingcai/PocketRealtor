const resTemplate = require("../static/ResponseTemplate");
const RoleType = require("../static/RoleType");
const TenantService = require("../services/TenantService");
const UserService = require("../services/UserService");

class TenantController {
  addTenantZipPreference(req, res) {
    // put a zip code
    let user = req.body.user;
    let zip = req.params.zip;
    if (!zip) {
      res.json(res.json(resTemplate.MISS_FIELD));
    }
    TenantService.addZipPreference(user.id, zip.toString(), res);
  }

  updateTenantPreference(req, res) {
    let user = req.body.user;
    let zipcodes = req.body.zipcodes; // zipcodes : [94117, 94118, ...]
    let cities = req.body.cities; // [{city: San Jose, state: CA}, {city: San Franciscoe, state: CA} ... ]

    if (zipcodes !== undefined) {
      if (!Array.isArray(zipcodes)) {
        res.json(resTemplate.INVALID_ZIP_CODE);
        return;
      } else {
        TenantService.updateZipPreference(user.id, zipcodes, res);
      }
    } else if (cities !== undefined) {
      if (!Array.isArray(cities)) {
        res.json(resTemplate.INVALID_INPUT);
        return;
      } else {
        TenantService.updateCityPreference(user.id, cities, res);
      }
    } else {
      res.json(resTemplate.MISS_FIELD);
    }
  }

  addCityPreference(req, res) {
    let user = req.body.user;
    let city = req.body.city;
    let state = req.body.state;
    if (city && state) {
      TenantService.addCityPreference(user.id, city, state, res);
    }
  }

  getTenantPreference(req, res) {
    let userId = req.params.userId;
    TenantService.getTenantPreference(userId, res);
  }

  searchTenants(req, res) {
    let city = req.query.city;
    let state = req.query.state;
    // let query = req.query.zipcodes;

    if (city && state) {
      let zipcodes = TenantService.cityToZipCodes(city, state);
      TenantService.findTenants(zipcodes, res);
    } else {
      TenantService.findAllTenants(res);
    }
  }

  addListingToFavorite(req, res) {
    let user = req.body.user;
    let listingId = req.params.listingId;

    if (!user || !listingId) {
      res.json(resTemplate.MISS_FIELD);
      return;
    }

    TenantService.addToFavorite(user.id, listingId).then((result) => {
      if (result) {
        res.json(resTemplate.SUCCESS);
      } else {
        res.status(500).send("Fail to add to favorite");
      }
    });
  }

  deleteOneFavoriteListing(req, res) {
    let user = req.body.user;
    let listingId = req.params.listingId;

    if (!user || !listingId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantService.deleteFavorite(user.id, listingId).then((result) => {
      if (result) {
        res.json(resTemplate.SUCCESS);
      } else {
        res.status(500).send("Fail to delete the favorite");
      }
    });
  }

  getFavoriteListings(req, res) {
    var userId = req.params.userId;
    if (!userId) {
      userId = req.body.user.id;
    }

    if (!userId) {
      res.status(403).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantService.getUserFavoriteListings(userId).then((favorites) => {
      if (favorites) {
        res.json(favorites);
      } else {
        res.json([]);
      }
    });
  }

  verifyTenantRole(req, res, next) {
    let user = req.body.user;
    let userId = user.id;
    if (!user) {
      res.status(403);
    }
    UserService.checkUserRole(userId, RoleType.RENTER.id).then((result) => {
      if (result) {
        next();
      } else {
        res.json(resTemplate.PERMISSION_DENY);
      }
    });
  }

  //===========
  test(req, res) {
    TenantService.test(10).then((ressult) => {
      res.json(ressult);
    });
  }
}

module.exports = new TenantController();

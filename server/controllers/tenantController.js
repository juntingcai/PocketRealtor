const resTemplate = require("../static/ResponseTemplate");

const UserRole = require("../models/roleModel");
const RoleType = require("../static/RoleType");
const TenantService = require("../services/TenantService");
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
    let user = req.body.user
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

  verifyTenantRole(req, res, next) {
    let user = req.body.user;
    let userId = user.id;

    UserRole.getUserRole(userId).then((roles) => {
      var isUserTenant = false;
      for (var i = 0; i < roles.length; i++) {
        let role = roles[i];
        console.log(role);
        if (role.role_id === RoleType.RENTER.id) {
          isUserTenant = true;
          break;
        }
      }
      if (isUserTenant) {
        next();
      } else {
        res.json(resTemplate.PERMISSION_DENY);
      }
    });
  }

  //===========
  test(req, res) {
    TenantService.testZip(req, res);
  }
}

module.exports = new TenantController();

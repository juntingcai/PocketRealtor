const resTemplate = require("../static/ResponseTemplate");
const {
  TenantZipPreference,
  User,
  UserRole,
  FavoriteListing,
  Listing,
} = require("../models/models");
const { Op, where } = require("sequelize");
const RoleType = require("../static/RoleType");
const zipCodeUtil = require("../utils/ZipCodeUtil");

class TenantService {
  updateZipPreference(userId, zips, res) {
    console.log(zips);
    for (var i = 0; i < zips.length; i++) {
      let zip = zips[i];
      if (!zipCodeUtil.isZipCodeValid(zip)) {
        console.log(zip + " is not valid");
        res.json(resTemplate.INVALID_ZIP_CODE);
        return;
      }
    }

    TenantZipPreference.destroy({ where: { user_id: userId } }).then(() => {
      console.log(zips);
      var data = [];
      for (var i = 0; i < zips.length; i++) {
        let zip = zips[i];
        let row = { user_id: userId, zip_code: zip };
        data.push(row);
      }
      TenantZipPreference.bulkCreate(data).then(() => {
        res.json(resTemplate.SUCCESS);
      });
    });
  }

  addZipPreference(userId, zip, res) {
    if (!zipCodeUtil.isZipCodeValid(zip)) {
      res.json(resTemplate.INVALID_ZIP_CODE);
      return;
    }

    TenantZipPreference.findOne({
      where: { user_id: userId, zip_code: zip },
    }).then((row) => {
      if (row) {
        res.json(resTemplate.SUCCESS);
      } else {
        TenantZipPreference.create({
          user_id: userId,
          zip_code: zip,
        }).then(() => {
          res.json(resTemplate.SUCCESS);
        });
      }
    });
  }

  updateCityPreference(userId, cities, res) {
    var preferredZips = [];
    for (var i = 0; i < cities.length; i++) {
      let city = cities[i];
      if (zipCodeUtil.isCityStateValid(city.city, city.state)) {
        let zipcodes = Array.from(
          zipCodeUtil.getZipCodesByCityState(city.city, city.state)
        );
        preferredZips = preferredZips.concat(zipcodes);
      }
    }
    this.updateZipPreference(userId, preferredZips, res);
  }

  addCityPreference(userId, city, state, res) {
    if (zipCodeUtil.isCityStateValid(city, state)) {
      this.updateZipPreference(
        userId,
        zipCodeUtil.getZipCodesByCityState(city, state),
        res
      );
    } else {
      res.json(resTemplate.NO_DATA);
    }
  }

  getTenantPreference(userId, res) {
    TenantZipPreference.findAll({
      attributes: ["zip_code"],
      where: { user_id: userId },
      row: true,
    })
      .then((preferredZips) => {
        let citySet = new Set();
        let zips = [];
        for (var i = 0; i < preferredZips.length; i++) {
          let zip = preferredZips[i].get("zip_code");
          zips.push(zip);
          let city = zipCodeUtil.getCityStateByZipCode(zip);
          citySet.add(city.city + ", " + city.state);
        }
        zips.sort((a, b) => a - b);
        let sortedCity = Array.from(citySet).sort();
        res.json({
          userId: userId,
          preferedZips: zips,
          preferredCities: sortedCity,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  findTenants(preferredZips, res) {
    User.findAll(/* TODO: where .... */).then((users) => {
      let userMap = new Map();
      let fitUserIds = [];
      for (var i = 0; i < users.length; i++) {
        let user = users[i];
        let userId = user.get("id");
        userMap.set(userId, user);
        fitUserIds.push(userId);
      }
      TenantZipPreference.findAll({
        attributes: ["user_id"],
        where: {
          user_id: {
            [Op.in]: fitUserIds,
          },
          zip_code: {
            [Op.in]: preferredZips,
          },
        },
        group: ["user_id"],
      }).then((fitUsers) => {
        let result = [];
        for (var i = 0; i < fitUsers.length; i++) {
          let fittingUser = userMap.get(fitUsers[i].get("user_id"));

          let resUser = {
            id: fittingUser.get("id"),
            firstname: fittingUser.get("first_name"),
            lastname: fittingUser.get("last_name"),
            email: fittingUser.get("email"),
            gender: fittingUser.get("gender"),
            occupation: fittingUser.get("occupation"),
            avatar: fittingUser.get("avatar"),
          };
          result.push(resUser);
        }
        res.json(result);
      });
    });
  }

  findAllTenants(res) {
    UserRole.findAll({
      attributes: ["user_id"],
      where: { role_id: RoleType.RENTER.id },
    })
      .then((ids) => {
        var userIds = [];
        for (var i = 0; i < ids.length; i++) {
          userIds.push(ids[i].get("user_id"));
        }
        User.findAll({
          where: {
            id: { [Op.in]: userIds },
          },
        }).then((users) => {
          var result = [];
          for (var i = 0; i < users.length; i++) {
            let user = users[i];
            let resUser = {
              id: user.get("id"),
              firstname: user.get("first_name"),
              lastname: user.get("last_name"),
              email: user.get("email"),
              gender: user.get("gender"),
              occupation: user.get("occupation"),
              avatar: user.get("avatar"),
            };
            result.push(resUser);
          }
          res.json(result);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async addToFavorite(userId, listingId) {
    let now = new Date();
    return await FavoriteListing.findOne({
      where: {
        user_id: userId,
        listing_id: listingId,
      },
    }).then((row) => {
      if (row) {
        return true;
      }
      FavoriteListing.create({
        user_id: userId,
        listing_id: listingId,
        create_time: now.getTime(),
      })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    });
  }

  async deleteFavorite(userId, listingId) {
    return await FavoriteListing.findOne({
      where: {
        user_id: userId,
        listing_id: listingId,
      },
    })
      .then((row) => {
        if (!row) {
          return true;
        }
        row.destroy().then(() => {
          return true;
        });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async getUserFavoriteListings(userId) {
    return await FavoriteListing.findAll({
      attributes: ["listing_id"],
      raw: true,
      where: { user_id: userId },
      order: [["create_time", "DESC"]],
    })
      .then((listingIds) => {
        if (!listingIds) {
          return undefined;
        }

        var ids = [];
        for (var i = 0; i < listingIds.length; i++) {
          let listingId = listingIds[i];
          ids.push(listingId.listing_id);
        }

        return Listing.findAll({
          raw: true,
          attributes: ["id", "title"],
          where: {
            id: ids,
          },
        })
          .then((results) => {
            return results;
          })
          .catch((err) => {
            console.log(err);
            return undefined;
          });
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }

  //==============================
  testZip(req, res) {}
}

module.exports = new TenantService();

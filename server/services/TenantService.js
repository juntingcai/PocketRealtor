const resTemplate = require("../static/ResponseTemplate");
const {
  TenantZipPreference,
  UsZipCode,
  User,
  UserRole,
} = require("../models/models");
const { Op } = require("Sequelize");
const RoleType = require("../static/RoleType");
const { user } = require("../database/config");

let zipCodeMap = new Map();
let cityZipMap = new Map();
class TenantService {
  constructor() {
    UsZipCode.findAll({
      row: true,
      attributes: ["zip", "state", "city"],
    }).then((zips) => {
      for (var i = 0; i < zips.length; i++) {
        let area = zips[i];
        let city = area.city + "," + area.state;
        zipCodeMap.set(area.zip, { state: area.state, city: area.city });

        if (cityZipMap.has(city)) {
          cityZipMap.get(city).push(area.zip);
        } else {
          cityZipMap.set(city, [area.zip]);
        }
      }
    });
  }

  updateZipPreference(userId, zips, res) {
    console.log(zips);
    for (var i = 0; i < zips.length; i++) {
      let zip = zips[i];
      if (!zipCodeMap.has(zip)) {
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
    if (!zipCodeMap.has(zip)) {
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
      let citystate = city.city + "," + city.state;
      if (cityZipMap.has(citystate)) {
        let c = Array.from(cityZipMap.get(citystate));
        preferredZips = preferredZips.concat(c);
      }
    }
    this.updateZipPreference(userId, preferredZips, res);
  }

  addCityPreference(userId, city, state, res) {
    let citystate = city + "," + state;
    if (cityZipMap.has(citystate)) {
      this.updateZipPreference(userId, cityZipMap.get(citystate), res);
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
          let city = zipCodeMap.get(zip);
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

  //==============util================
  cityToZipCodes(city, state) {
    let citystate = city + "," + state;
    return cityZipMap.get(citystate);
  }

  getCityByZipCode(zip) {
    return zipCodeMap.get(zip);
  }

  //==============================
  testZip(req, res) {
    let zips = cityZipMap.get("San Francisco,CA");
    console.log(zips);
    res.json({ zips: zips });
  }
}

module.exports = new TenantService();

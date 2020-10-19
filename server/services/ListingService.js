const { User, Listing } = require("../models/models");
const { Op } = require("sequelize");
const resTemplate = require("../static/ResponseTemplate");

class ListingService {
  findRentListings(conditions, res) {
    let queryOptions = getFindListingQueryOptions(conditions, true);
    
    Listing.findAll({ raw: true, where: queryOptions }).then((listings) => {
      res.json(listings);
    });
  }

  findSaleListings(conditions, res) {
    let queryOptions = getFindListingQueryOptions(conditions, false);
    Listing.findAll({ raw: true, where: queryOptions }).then((listings) => {
      res.json(listings);
    });
  }

  getListingById(listingId, res) {
    Listing.findByPk(listingId).then((listing) => {
      if (listing) {
        res.json(listing);
      } else {
        res.json(resTemplate.NO_DATA);
      }
    });
  }

  createListing(ownerId, property, res) {
    property.owner_id = ownerId;
    Listing.create(property)
      .then((listing) => {
        res.json(listing);
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
      });
  }

  duplicateListing(ownerId, listingId, res) {
    Listing.findByPk(listingId)
      .then((listing) => {
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
          owner_id: ownerId,
        };

        Listing.create(replicatedListing).then((newListing) => {
          if (newListing) {
            res.json(newListing);
          } else {
            console.log("Fail to add the listing");
            res.status(500);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
      });
  }

  updateListing(userId, listingId, property, res) {
    Listing.findByPk(listingId).then((listing) => {
      if (listing) {
        if (listing.owner_id != userId) {
          res.json(resTemplate.PERMISSION_DENY);
          return;
        } else {
          if (property.title) {
            listing.title = property.title;
          }
          if (property.description) {
            listing.description = property.description;
          }
          if (property.address) {
            listing.address = property.address;
          }
          if (property.city) {
            listing.city = property.city;
          }
          if (property.state) {
            listing.state = property.state;
          }
          if (property.latitude) {
            listing.latitude = property.latitude;
          }
          if (property.longitude) {
            listing.longitude = property.longitude;
          }
          if (property.rooms) {
            listing.rooms = property.rooms;
          }
          if (property.zip_code) {
            listing.zip_code = property.zip_code;
          }
          if (property.type) {
            listing.type = property.type;
          }
          if (property.rent_price) {
            listing.rent_price = property.rent_price;
          }
          if (property.sale_price) {
            listing.sale_price = property.sale_price;
          }
          if (property.bath_rooms) {
            listing.bath_rooms = property.bath_rooms;
          }
          if (property.area) {
            listing.area = property.area;
          }
          if (property.age) {
            listing.age = property.age;
          }

          listing
            .save()
            .then(() => {
              res.json(listing);
            })
            .catch((err) => {
              console.log(err);
              res.json(resTemplate.INVALID_INPUT);
            });
        }
      } else {
        res.json(resTemplate.NO_DATA);
      }
    });
  }

  deleteListing(userId, listingId, res) {
    Listing.findByPk(listingId)
      .then((listing) => {
        if (listing.owner_id != userId) {
          res.json(resTemplate.PERMISSION_DENY);
          return;
        }
        listing.destroy().then(() => {
          res.json(resTemplate.SUCCESS);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
      });
  }
}

function getRangeInMile(latitude, longitude, radiusMile) {
  let degree = (24901 * 1609) / 360.0;
  let dpmLat = 1 / degree;
  let radiusLat = dpmLat * radiusMile;
  let minLat = latitude - radiusLat;
  let maxLat = latitude + radiusLat;
  let mpdLng = degree * Math.cos(latitude * (Math.PI / 180));
  let dpmLng = 1 / mpdLng;
  let radiusLng = dpmLng * radiusMile;
  let minLng = longitude - radiusLng;
  let maxLng = longitude + radiusLng;

  return {
    minLat: minLat,
    maxLat: maxLat,
    minLng: minLng,
    maxLng: maxLng,
  };
}

function getRangeInKm(latitude, longitude, radiusInKm) {
  let kmInLongitudeDegree = 111.320 * Math.cos( latitude / 180.0 * Math.PI)

  let deltaLat = radiusInKm / 111.1;
  let deltaLong = radiusInKm / kmInLongitudeDegree;

  let minLat = latitude - deltaLat;  
  let maxLat = latitude + deltaLat;
  let minLng = longitude - deltaLong; 
  let maxLng = longitude + deltaLong;
  return {
    minLat: minLat,
    maxLat: maxLat,
    minLng: minLng,
    maxLng: maxLng,
  };
}

function getFindListingQueryOptions(conditions, isRenting) {
  let latitude = conditions.latitude;
  let longitude = conditions.longitude;
  let radius = conditions.radius;

  if (!latitude || !longitude || !radius) {
    res.json(resTemplate.MISS_FIELD);
    return;
  }
  let range = getRangeInKm(latitude, longitude, radius);

  let queryOptions = {
    latitude: { [Op.and]: [{ [Op.gte]: range.minLat }, { [Op.lte]: range.maxLat }]},
    longitude: { [Op.and]: [{ [Op.gte]: range.minLng }, { [Op.lte]: range.maxLng }]}
  };

  let minPrice = 0;
  let maxPrice = Number.MAX_SAFE_INTEGER;
  if (conditions.minPrice && conditions.minPrice > 0) {
    minPrice = conditions.minPrice;
  }
  if (conditions.maxPrice && maxPrice > 0) {
    maxPrice = conditions.maxPrice;
  }

  if (isRenting) {
    queryOptions.rent_price = {
      [Op.or]: [{ [Op.between]: [minPrice, maxPrice] }, { [Op.is]: null }],
    };
  } else {
    queryOptions.sale_price = {
      [Op.or]: [{ [Op.between]: [minPrice, maxPrice] }, { [Op.is]: null }],
    };
  }

  let bedrooms = conditions.bedrooms;
  if (bedrooms && bedrooms > 0) {
    queryOptions.rooms = { [Op.gte]: bedrooms };
  }
  let bathrooms = conditions.bathrooms;
  if (bathrooms && bathrooms > 0) {
    queryOptions.bath_rooms = { [Op.gte]: bathrooms };
  }
  console.log(queryOptions);
  return queryOptions;
}

module.exports = new ListingService();

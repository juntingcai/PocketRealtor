const { Listing } = require("./models");

//
//   A well prepared listing should look like:
//   {
//      id : 1 ,
//      title : "My Elegant house",
//      introduction : "A good house",
//      address : "2312 Cool Stree.",
//      city : "San Francisco",
//      state : "CA",
//      zip_code : 94118,
//      latitude : 23.232456,
//      longitude : 123.123456,
//      price : 1331234,
//      rooms : 5,
//      image_links : null,
//   }
//

class ListingModel {
  async createListing(listing) {
    return await Listing.create(listing);
  }

  async updateListing(listing) {
    // TODO
  }

  async deleteListing(listingId) {
    return await Listing.destroy({where: {id : listingId}});
  }

  async findListingById(listingId) {
    return await Listing.findByPk(listingId);
  }

  async findListingByOwnerId(ownerId) {
    return await Listing.findAll({
      raw: true,
      where: { owner_id: ownerId },
    });
  }

  async findAllListing() {
    return await Listing.findAll({
      raw: true,
    });
  }
}

module.exports = new ListingModel();

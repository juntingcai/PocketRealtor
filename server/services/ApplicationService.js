const ApplicationState = require("../../common/Constans/ApplicationState");
const GroupMemberState = require("../../common/Constans/GroupMemberState");
const listingApplication = require("../models/listingApplication");
const {
  User,
  TenantGroups,
  GroupMembers,
  Listing,
  TenantGroupListings,
  GroupChatRoom,
  ListingApplications,
} = require("../models/models");

class ApplicationService {
  applyListing(groupId, listing_owner_id, listingId, description) {
    return ListingApplications.findOne({
      where: {
        group_id: groupId,
        listing_id: listingId,
      },
    }).then((application) => {
      if (application) {
        return false;
      }
      return ListingApplications.create({
        group_id: groupId,
        listing_id: listingId,
        description: description,
        state: ApplicationState.PENDING.id,
      }).then(() => {
        GroupMembers.create({
          group_id: groupId,
          user_id: listing_owner_id,
          state: GroupMemberState.HOUSE_OWNER.id,
        });
        return true;
      });
    });
  }

  updateApplication(groupId, listingId, description) {
    return ListingApplications.findOne({
      where: {
        group_id: groupId,
        listing_id: listingId,
      },
    }).then((application) => {
      if (!application) {
        return false;
      }
      application.description = description;
      application.save().then(() => {
        return true;
      });
    });
  }

  deleteApplication(groupId, listingId) {
    return ListingApplications.findOne({
      where: {
        group_id: groupId,
        listing_id: listingId,
      },
    }).then((application) => {
      if (!application) {
        return true;
      }
      application.destroy().then(() => {
        GroupMembers.destroy({
          where: {
            group_id: groupId,
            user_id: listing_owner_id,
            state: GroupMemberState.HOUSE_OWNER.id,
          },
        });
        return true;
      });
    });
  }

  changeApplicationState(groupId, listingId, stateId) {
    return ListingApplications.findOne({
      where: {
        group_id: groupId,
        listing_id: listingId,
      },
    }).then((application) => {
      if (!application) {
        return undefined;
      }
      application.state = stateId;
      application
        .save()
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    });
  }

  getApplicationsByListingId(listingId) {
    return listingApplication
      .findAll({
        raw: true,
        attributes: [
          ["group_id", "groupId"],
          ["tenant_groups.name", "name"],
          ["tenant_groups.description", "description"],
          "state"[("createdAt", "applyAt")],
        ],
        where: {
          listing_id: listingId,
        },
        include: {
          model: TenantGroups,
          attributes: [],
        },
        order: [["createdAt", "DESC"]],
      })
      .then((groups) => {
        return groups;
      });
  }
}

const { User, TenantGroups, GroupMembers } = require("../models/models");
const { Op, Sequelize } = require("sequelize");

const GroupMemberState = require("../../common/Constans/GroupMemberState");
const groupMembers = require("../models/groupMembers");
class TenantGroupService {
  // owner
  // create a group
  createGroup(ownerId, groupInfo) {
    let name = groupInfo.name;
    let description = groupInfo.description;

    let newGroup = {
      name: name,
      description: description,
      notes: [],
      owner_id: ownerId,
    };

    return TenantGroups.create(newGroup)
      .then((group) => {
        if (group) {
          return group.id;
        } else {
          return undefined;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }

  // update a group's information
  updateGroup(ownerId, groupId, groupInfo) {
    let name = groupInfo.name;
    let description = groupInfo.description;

    return TenantGroups.findByPk(groupId).then((group) => {
      if (group.owner_id !== ownerId) {
        console.log("ownerId is different from the id in database");
        return undefined;
      }
      if (name) {
        group.name = name;
      }
      if (description) {
        group.description = description;
      }
      return group
        .save()
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
    });
  }
  // delete a group
  deleteGroup(ownerId, groupId) {
    return TenantGroups.findByPk(groupId).then((group) => {
      if (group.owner_id !== ownerId) {
        console.log("ownerId is different from the id in database");
        return undefined;
      }
      return group
        .destroy()
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
    });
  }

  // get a group
  getGroupDescription(groupId) {
    return TenantGroups.findByPk(groupId)
      .then(async (group) => {
        if (!group) {
          console.log("Cannot find the group");
          return undefined;
        }

        let groupInfo = {
          id: group.id,
          name: group.name,
          description: group.description,
        };

        let ownerId = group.owner_id;

        await GroupMembers.count({
          where: {
            group_id: group.id,
            state: GroupMemberState.APPROVED.id,
          },
        }).then((cnt) => {
          groupInfo.size = cnt + 1; // owner does not be counted, so add 1 here
        });

        await User.findByPk(ownerId).then((user) => {
          let owner = {
            id: user.id,
            name: user.first_name + " " + user.last_name,
            avatar: user.avatar,
          };
          groupInfo.owner = owner;
        });

        return groupInfo;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }

  //getWaitingTenant
  getWaitingTenant(groupId) {
    return GroupMembers.findAll({
      where: {
        group_id: groupId,
        state: GroupMemberState.WAITING.id,
      },
      order: [["updated_at", "ASC"]],
    }).then((waitingUsers) => {
      console.log(waitingUsers);
      var waitingUsersId = [];
      for (var i = 0; i < waitingUsers.length; i++) {
        let waitingUser = waitingUsers[i];
        waitingUsersId.push(waitingUser.user_id);
      }

      return User.findAll({
        raw: true,
        attributes: [
          "id",
          ["first_name", "firstname"],
          ["last_name", "lastname"],
          "avatar",
        ],
        where: { id: waitingUsersId },
      })
        .then((users) => {
          return users;
        })
        .catch((err) => {
          console.log(err);
          return undefined;
        });
    });
  }

  // verify applications
  respondWaitingTenant(groupId, waitingUserId, approved) {
    return GroupMembers.findOne({
      where: {
        group_id: groupId,
        user_id: waitingUserId,
      },
    }).then((waitingUser) => {
      if (!waitingUser || waitingUser.state !== GroupMemberState.WAITING.id) {
        return false;
      }
      if (approved) {
        waitingUser.state = GroupMemberState.APPROVED.id;
        return waitingUser.save().then(() => {
          return true;
        });
      } else {
        return waitingUser.destroy().then(() => {
          return true;
        });
      }
    });
  }

  // invite others
  inviteTenant(groupId, inviteeId) {
    return GroupMembers.findOne({
      where: {
        user_id: inviteeId,
        group_id: groupId,
      },
    }).then((member) => {
      if (member) {
        return false;
      }
      return GroupMembers.create({
        group_id: groupId,
        user_id: inviteeId,
        state: GroupMemberState.INVITED.id,
      }).then(() => {
        return true;
      });
    });
  }

  // members
  // apply a group
  applyGroup(userId, groupId) {
    return TenantGroups.findByPk(groupId).then((group) => {
      if (!group) {
        console.log("Cannot find the group");
        return undefined;
      }

      return GroupMembers.findOne({
        where: {
          user_id: userId,
          group_id: groupId,
        },
      }).then((application) => {
        if (application) {
          return false;
        }
        return GroupMembers.create({
          user_id: userId,
          group_id: groupId,
          state: GroupMemberState.WAITING.id,
        }).then(() => {
          return true;
        });
      });
    });
  }

  // get the groups that the user has applied
  getApplyingGroup(userId) {
    return GroupMembers.findAll({
      where: {
        user_id: userId,
        state: GroupMemberState.WAITING.id,
      },
    }).then(async (waitingList) => {
      var waitingGroupIds = [];
      for (var i = 0; i < waitingList.length; i++) {
        waitingGroupIds.push(waitingList[i].group_id);
      }
      var result = [];
      await TenantGroups.findAll({
        where: {
          id: waitingGroupIds,
        },
      }).then((groups) => {
        for (var i = 0; i < groups.length; i++) {
          let group = groups[i];
          result.push({
            groupId: group.id,
            name: group.name,
          });
        }
      });
      return result;
    });
  }

  cancelApplication(userId, groupId) {
    return GroupMembers.findOne({
      where: {
        user_id: userId,
        group_id: groupId,
        state: GroupMemberState.WAITING.id,
      },
    })
      .then((application) => {
        if (!application) {
          return false;
        }
        return application.destroy().then(() => {
          return true;
        });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  getGroupDetail(userId, groupId) {
    return TenantGroups.findByPk(groupId).then(async (group) => {
      let result = {};
      result.id = group.id;
      result.name = group.name;
      result.description = group.description;
      result.notes = group.notes;

      await User.findByPk(group.owner_id).then((owner) => {
        if (owner) {
          result.owner = {
            id: owner.id,
            firstname: owner.first_name,
            lastname: owner.last_name,
            avatar: owner.avatar,
          };
        }
      });

      await GroupMembers.findAll({
        where: {
          group_id: groupId,
          state: GroupMemberState.APPROVED.id,
        },
      }).then(async (members) => {
        var memberIds = [];
        for (var i = 0; i < members.length; i++) {
          let member = members[i];
          memberIds.push(member.user_id);
        }
        await User.findAll({
          where: {
            id: memberIds,
          },
        }).then((users) => {
          var members = [];
          for (var i = 0; i < users.length; i++) {
            let member = users[i];
            members.push({
              id: member.id,
              firstname: member.first_name,
              lastname: member.last_name,
              avatar: member.avatar,
            });
          }
          result.members = members;
        });
      });

      return result;
    });
  }

  respondInvitation(userId, groupId, accept) {
    return GroupMembers.findOne({
      where: {
        user_id: userId,
        group_id: groupId,
        state: GroupMemberState.INVITED.id,
      },
    }).then((invitee) => {
      if (!invitee) {
        return false;
      }
      if (accept) {
        invitee.state = GroupMemberState.APPROVED.id;
        return invitee
          .save()
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      } else {
        return invitee
          .destroy()
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    });
  }

  //TODO: leave a group
  leaveGroup(userId, groupId) {}

  // all people
  // put a message (note)
  async putMessage(userId, groupId, message) {
    let date = new Date();
    let note = {
      message: message,
      date: [date.getFullYear(), date.getMonth(), date.getDate()].join("-"),
      time: [date.getHours(), date.getMinutes(), date.getSeconds()].join(":"),
    };

    await User.findByPk(userId).then((user) => {
      note.user = {
        id: user.id,
        firstname: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
      };
    });

    return TenantGroups.findByPk(groupId).then((group) => {
      if (!group) {
        return false;
      }
      let notes = Array.from(group.notes);
      notes.push(note);
      group.notes = notes;
      return group
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

  addListing(userId, groupId, listingId) {
    //TODO:
  }

  verifyGroupOnwer(userId, groupId) {
    console.log(userId);
    return TenantGroups.findByPk(groupId).then((group) => {
      if (!group) {
        console.log("Cannot Find the group: " + groupId);
        return false;
      }
      if (group.owner_id == userId) {
        return true;
      } else {
        return false;
      }
    });
  }

  verifyGroupMember(userId, groupId) {
    return GroupMembers.findOne({
      where: {
        user_id: userId,
        group_id: groupId,
        state: GroupMemberState.APPROVED.id,
      },
    }).then((approved) => {
      if (approved) {
        return true;
      }
      return this.verifyGroupOnwer(userId, groupId);
    });
  }
}

module.exports = new TenantGroupService();

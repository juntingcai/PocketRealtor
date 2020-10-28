const { User, TenantGroups, GroupMembers } = require("../models/models");
const { Op, Sequelize } = require("sequelize");

const GroupMemberState = require("../../common/Constans/GroupMemberState");

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
          GroupMembers.create({
            group_id: group.id,
            user_id: ownerId,
            state: GroupMemberState.OWNER.id,
          });
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
            state: [GroupMemberState.APPROVED.id, GroupMemberState.OWNER.id],
          },
        }).then((cnt) => {
          groupInfo.size = cnt;
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
  getWaitingTenants(groupId) {
    return GroupMembers.findAll({
      raw: true,
      attributes: [
        [Sequelize.col("user.id"), "id"],
        [Sequelize.col("user.first_name"), "firstname"],
        [Sequelize.col("user.last_name"), "lsstname"],
        [Sequelize.col("user.avatar"), "avatar"],
        [Sequelize.col("updated_at"), "applyAt"],
      ],
      where: {
        group_id: groupId,
        state: GroupMemberState.WAITING.id,
      },
      include: {
        model: User,
        attributes: [],
      },
      order: [["updated_at", "ASC"]],
    })
      .then((waitingUsers) => {
        return waitingUsers;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
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

  // get invitation

  getInvitation(groupId) {
    return GroupMembers.findAll({
      raw: true,
      attributes: [
        [Sequelize.col("user.id"), "id"],
        [Sequelize.col("user.first_name"), "firstname"],
        [Sequelize.col("user.last_name"), "lastname"],
        [Sequelize.col("user.avatar"), "avatar"],
        [Sequelize.col("updated_at"), "invitedAt"],
      ],
      where: {
        group_id: groupId,
        state: GroupMemberState.INVITED.id,
      },
      include: {
        model: User,
        attributes: [],
      },
      order: [["updated_at", "ASC"]],
    })
      .then((invitees) => {
        return invitees;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
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
  getUserApllyingGroups(userId) {
    return GroupMembers.findAll({
      raw: true,
      attributes: [
        [Sequelize.col("tenant_group.id"), "id"],
        [Sequelize.col("tenant_group.name"), "name"],
        [Sequelize.col("tenant_group.description"), "description"],
        [Sequelize.col("created_at"), "applyAt"],
      ],
      where: {
        user_id: userId,
        state: GroupMemberState.WAITING.id,
      },
      include: {
        model: TenantGroups,
        attributes: [],
      },
      order: [["created_at", "ASC"]],
    })
      .then((groups) => {
        console.log(groups);
        return groups;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
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

  getGroupDetail(groupId) {
    return TenantGroups.findByPk(groupId, {
      include: {
        model: User,
        attributes: ["id", "first_name", "last_name", "avatar"],
      },
    }).then(async (group) => {
      if (!group) {
        return undefined;
      }
      let result = {};
      result.id = groupId;
      result.name = group.name;
      result.description = group.description;
      result.notes = group.notes;
      result.owner = {
        id: group.user.id,
        firstname: group.user.first_name,
        lastname: group.user.last_name,
        avatar: group.user.avatar,
      };

      await GroupMembers.findAll({
        raw: true,
        attributes: [
          [Sequelize.col("user.id"), "id"],
          [Sequelize.col("user.first_name"), "firstname"],
          [Sequelize.col("user.last_name"), "lastname"],
          [Sequelize.col("user.avatar"), "avatar"],
          [Sequelize.col("updated_at"), "addedAt"],
        ],
        where: {
          group_id: groupId,
          state: GroupMemberState.APPROVED.id,
        },
        include: {
          model: User,
          attributes: [],
        },
        order: [["updated_at", "ASC"]],
      }).then((members) => {
        result.members = members;
      });

      return result;
    });
  }

  getUserGroupList(userId) {
    return GroupMembers.findAll({
      raw: true,
      attributes: [
        [Sequelize.col("tenant_group.id"), "id"],
        [Sequelize.col("tenant_group.name"), "name"],
        [Sequelize.col("tenant_group.description"), "description"],
        [Sequelize.col("updated_at"), "addedAt"],
      ],
      where: {
        user_id: userId,
        state: [GroupMemberState.APPROVED.id, GroupMemberState.OWNER.id],
      },
      include: {
        model: TenantGroups,
        attributes: [],
      },
    })
      .then((groups) => {
        return groups;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
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
        state: [GroupMemberState.APPROVED.id, GroupMemberState.OWNER.id],
      },
    }).then((approved) => {
      if (approved) {
        return true;
      } else {
        return false;
      }
    });
  }
}

module.exports = new TenantGroupService();

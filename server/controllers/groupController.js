const resTemplate = require("../static/ResponseTemplate");
const TenantGroupService = require("../services/TenantGroupService");
const { User } = require("../models/models");

class GroupController {
  // Group CRUD
  createGroup(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }

    let name = req.body.name;
    let description = req.body.description;

    if (!name || !description) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    let groupInfo = {
      name: name,
      description: description,
    };

    TenantGroupService.createGroup(user.id, groupInfo).then((result) => {
      if (result) {
        res.json({ code: 10000, msg: "Request Success", groupId: result });
      } else {
        res.status(500).json(resTemplate.DATABASE_ERROR);
      }
    });
  }

  updateGroup(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }

    let name = req.body.name;
    let description = req.body.description;
    let groupId = req.body.groupId;
    if (!groupId || (!name && !description)) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    TenantGroupService.verifyGroupOnwer(user.id, groupId).then((approved) => {
      if (approved) {
        let groupInfo = {};
        if (name) {
          groupInfo.name = name;
        }
        if (description) {
          groupInfo.description = description;
        }
        TenantGroupService.updateGroup(user.id, groupId, groupInfo).then(
          (result) => {
            if (result) {
              res.json(resTemplate.SUCCESS);
            } else {
              res.status(500).json(resTemplate.DATABASE_ERROR);
            }
          }
        );
      } else {
        res.status(403).json(resTemplate.PERMISSION_DENY);
        return;
      }
    });
  }

  deleteGroup(req, res) {
    let groupId = req.params.id;
    let user = req.body.user;

    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }

    if (!groupId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantGroupService.verifyGroupOnwer(user.id, groupId).then((approved) => {
      if (approved) {
        TenantGroupService.deleteGroup(user.id, groupId).then((result) => {
          if (result) {
            res.json(resTemplate.SUCCESS);
          } else {
            res.status(500).json(resTemplate.DATABASE_ERROR);
          }
        });
      } else {
        res.status(403).json(resTemplate.PERMISSION_DENY);
        return;
      }
    });
  }

  async getGroup(req, res) {
    let groupId = req.params.id;
    let user = req.body.user;

    if (!groupId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    var group = undefined;
    if (user) {
      await TenantGroupService.verifyGroupMember(user.id, groupId).then(
        async (isGroupMember) => {
          if (isGroupMember) {
            await TenantGroupService.getGroupDetail(user.id, groupId).then(
              (result) => {
                group = result;
              }
            );
          } else {
            await TenantGroupService.getGroupDescription(groupId).then(
              (result) => {
                group = result;
              }
            );
          }
        }
      );
    } else {
      await TenantGroupService.getGroupDescription(groupId).then((result) => {
        group = result;
      });
    }

    if (group) {
      res.json(group);
    } else {
      res.status(404).json(resTemplate.NO_DATA);
    }
  }

  // Members
  // invite
  inviteTenant(req, res) {
    let owner = req.body.user;
    if (!owner) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    let groupId = req.body.groupId;
    let email = req.body.email;
    let userId = req.body.userId;
    if (!groupId || (!email && !userId)) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    let queryCondition = {};
    if (userId) {
      queryCondition.id = userId;
    } else if (email) {
      queryCondition.email = email;
    }

    TenantGroupService.verifyGroupOnwer(owner.id, groupId).then((approved) => {
      if (approved) {
        User.findOne({ where: queryCondition }).then((invitee) => {
          if (!invitee) {
            res.status(404).json(resTemplate.USER_NOT_EXIST);
            return;
          }
          TenantGroupService.inviteTenant(groupId, invitee.id).then(
            (result) => {
              if (result) {
                res.json(resTemplate.SUCCESS);
              } else {
                res.status(400).send("You have invited the user");
              }
            }
          );
        });
      } else {
        res.status(401).json(resTemplate.PERMISSION_DENY);
      }
    });
  }
  // accept/reject invite
  acceptInvitation(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }
    let groupId = req.params.groupId;
    if (!groupId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    TenantGroupService.respondInvitation(user.id, groupId, true).then(
      (result) => {
        if (result) {
          res.json(resTemplate.SUCCESS);
        } else {
          res.status(500).send("Fail to accept the invitation");
        }
      }
    );
  }
  rejectInvitation(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    let groupId = req.params.groupId;
    if (!groupId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    TenantGroupService.respondInvitation(user.id, groupId, false).then(
      (result) => {
        if (result) {
          res.json(resTemplate.SUCCESS);
        } else {
          res.status(500).json(resTemplate.DATABASE_ERROR);
        }
      }
    );
  }
  // apply
  applyGroup(req, res) {
    let user = req.body.user;
    let groupId = req.params.groupId;

    if (!user) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }

    if (!groupId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantGroupService.applyGroup(user.id, groupId).then((result) => {
      if (result) {
        res.json(resTemplate.SUCCESS);
      } else if (result == undefined) {
        res.status(400).send("The group does not exist");
      } else {
        res.status(400).send("You have appied, waiting for host's response");
      }
    });
  }
  // accept/deny apply
  respondApplication(req, res) {
    let owner = req.body.user;
    let groupId = req.body.groupId;
    let applicantId = req.body.applicantId;
    let approved = req.body.approved;

    if (!owner) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }
    if (!groupId || !applicantId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    if (isNaN(parseInt(groupId)) || isNaN(parseInt(applicantId))) {
      res.status(400).json(resTemplate.INVALID_INPUT);
      return;
    }

    if (approved == undefined) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantGroupService.verifyGroupOnwer(owner.id, groupId).then(
      (isGroupOwner) => {
        if (!isGroupOwner) {
          res.status(403).json(resTemplate.PERMISSION_DENY);
        }

        TenantGroupService.respondWaitingTenant(
          groupId,
          applicantId,
          approved
        ).then((result) => {
          if (result) {
            res.json(resTemplate.SUCCESS);
          } else {
            res.status(400).send("The user is not existing or not waiting");
          }
        });
      }
    );
  }

  // [Group Owner] get waiting tenants
  getWaitingTenants(req, res) {
    let owner = req.body.user;
    if (!owner) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }

    let groupId = req.params.groupId;

    if (!groupId || isNaN(parseInt(groupId))) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    TenantGroupService.verifyGroupOnwer(owner.id, groupId).then((isOwner) => {
      if (!isOwner) {
        res.status(403).json(resTemplate.PERMISSION_DENY);
        return;
      }
      TenantGroupService.getWaitingTenant(groupId).then((result) => {
        res.json(result);
      });
    });
  }
  // [Applicant] get applying groups
  getApplyingGroups(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }

    TenantGroupService.getApplyingGroup(user.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(resTemplate.DATABASE_ERROR);
      });
  }

  cancelApplication(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }
    let groupId = req.params.groupId;
    if (!groupId || isNaN(parseInt(groupId))) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    TenantGroupService.cancelApplication(user.id, groupId).then((result) => {
      if (result) {
        res.json(resTemplate.SUCCESS);
      } else {
        res.status(400).send("The application does not exist");
      }
    });
  }

  putMessage(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(401).json(resTemplate.TOKEN_ERR);
      return;
    }
    let groupId = req.params.groupId;
    if (!groupId || isNaN(parseInt(groupId))) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }

    let message = req.body.message;
    if (!message || message.length == 0) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    TenantGroupService.verifyGroupMember(user.id, groupId).then((isMember) => {
      if (!isMember) {
        res.status(403).json(resTemplate.PERMISSION_DENY);
        return;
      }
      TenantGroupService.putMessage(user.id, groupId, message).then(
        (result) => {
          if (result) {
            res.json(resTemplate.SUCCESS);
          } else {
            res.status(500).json(resTemplate.DATABASE_ERROR);
          }
        }
      );
    });
  }
}

module.exports = new GroupController();

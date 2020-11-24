const {
  User,
  TenantGroups,
  GroupChatRoom,
  GroupMembers,
  PersonalChatRoom,
} = require("../models/models");
const { uuid } = require("uuidv4");
const { Op, Sequelize } = require("sequelize");
const GroupMemberState = require("../../common/Constans/GroupMemberState");

class ChatRoomService {
  findOrCreatePersonalChat(hostId, targetId) {
    var r1 = hostId;
    var r2 = targetId;
    if (targetId < hostId) {
      r1 = targetId;
      r2 = hostId;
    }

    return PersonalChatRoom.findOne({
      where: {
        recipient1: r1,
        recipient2: r2,
      },
    })
      .then((chatroom) => {
        if (!chatroom) {
          let chatroomId = uuid();
          return PersonalChatRoom.create({
            id: chatroomId,
            recipient1: r1,
            recipient2: r2,
            messages: [],
          }).then((newPersonalChatRoom) => {
            return newPersonalChatRoom.id;
          });
        } else {
          return chatroom.id;
        }
      })
      .catch((err) => {
        console.log(err);
        return undefined;
      });
  }

  getUserPersonalChatRooms(userId) {
    return PersonalChatRoom.findAll({
      raw: true,
      where: {
        [Op.or]: {
          recipient1: userId,
          recipient2: userId,
        },
      },
    }).then((chatrooms) => {
      let userNameMap = new Map();
      let userIds = [];
      for (var i = 0; i < chatrooms.length; i++) {
        let ct = chatrooms[i];
        let uid = ct.recipient1 == userId ? ct.recipient2 : ct.recipient1;
        userIds.push(uid);
      }
      if (userIds.length != 0) {
        return User.findAll({
          raw: true,
          attributes: ["id", "first_name", "last_name", "avatar"],
          where: {
            id: userIds,
          },
        }).then((users) => {
          for (var i = 0; i < users.length; i++) {
            let user = users[i];
            userNameMap.set(user.id, {
              name: user.first_name + " " + user.last_name,
              avatar: user.avatar,
            });
          }

          let userChatRooms = [];
          for (var i = 0; i < chatrooms.length; i++) {
            let ct = chatrooms[i];
            let targetId =
              ct.recipient1 == userId ? ct.recipient2 : ct.recipient1;
            let userinfo = userNameMap.get(targetId);
            userChatRooms.push({
              conversactionId: ct.id,
              targetId: targetId,
              targetName: userinfo.name,
              messgaes: ct.messages,
              img: userinfo.avatar,
            });
          }
          return userChatRooms;
        });
      }

      return [];
    });
  }

  getUserGroupChatRooms(userId) {
    return GroupMembers.findAll({
      raw: true,
      attributes: ["group_id", [Sequelize.col("tenant_group.name"), "name"]],
      where: {
        user_id: userId,
        state: [GroupMemberState.OWNER.id, GroupMemberState.APPROVED.id],
      },
      include: {
        model: TenantGroups,
        attributes: [],
      },
    }).then((groups) => {
      let groupNameMap = new Map();
      let groupIds = [];
      for (var i = 0; i < groups.length; i++) {
        let g = groups[i];
        groupIds.push(g.group_id);
        groupNameMap.set(g.group_id, g.name);
      }
      return GroupChatRoom.findAll({
        raw: true,
        where: {
          group_id: groupIds,
        },
      }).then((groupChatRooms) => {
        let userGroupChatRooms = [];
        for (var i = 0; i < groupChatRooms.length; i++) {
          let ct = groupChatRooms[i];
          userGroupChatRooms.push({
            conversactionId: ct.id,
            targetId: ct.group_id,
            targetName: groupNameMap.get(ct.group_id),
            messgaes: ct.messages,
            img: "/",
          });
        }
        return userGroupChatRooms;
      });
    });
  }

  getChatRoom(userId, chatRoomId) {
    return PersonalChatRoom.findByPk(chatRoomId).then((personalChat) => {
      if (!personalChat) {
        // group chat
        return GroupChatRoom.findByPk(chatRoomId, {
          raw : true,
          attributes: [
            "group_id",
            "messages",
            [Sequelize.col("tenant_group.name"), "name"],
          ],
          include: {
            model: TenantGroups,
            attributes: [],
          },
        })
          .then((groupChat) => {
            if (!groupChat) {
              return undefined;
            }
            console.log(groupChat);
            return {
              targetId: groupChat.group_id,
              targetName: groupChat.name,
              img: "/",
              messages: groupChat.messages,
              isGropuChat: true,
            };
          })
          .catch((err) => {
            console.log(err);
            return undefined;
          });
      }
      console.log(personalChat);
      let targetId =
      personalChat.recipient1 == userId ? personalChat.recipient2 : personalChat.recipient1;
      return User.findByPk(targetId).then((user) => {
        return {
        targetId : targetId,
        targetName : user.frst_name + " " + user.last_name,
        img : user.avatar,
        messages : personalChat.messages,
        isGropuChat : false,
      }
      });
    });
  }

  putMessage(userId, isGroupChat, chatRoomId, content) {
    let now = new Date();
    let message = {
      senderId: userId,
      content: content,
      date: now,
    };
    if (isGroupChat) {
      return GroupChatRoom.update(
        {
          messages: Sequelize.fn(
            "array_append",
            Sequelize.col("messages"),
            JSON.stringify(message)
          ),
        },
        { where: { id: chatRoomId } }
      )
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else {
      return PersonalChatRoom.update(
        {
          messages: Sequelize.fn(
            "array_append",
            Sequelize.col("messages"),
            JSON.stringify(message)
          ),
        },
        { where: { id: chatRoomId } }
      )
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }
  }
}

module.exports = new ChatRoomService();

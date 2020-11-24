const groupChatRoom = require("../models/groupChatRoom");
const resTemplate = require("../static/ResponseTemplate");
const { isUuid } = require("uuidv4");
const ChatRoomService = require("../services/ChatRoomService");
class ChatRoomController {
  findPersonalChatroom(req, res) {
    let user = req.body.user;
    let targetId = req.params.userId;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    if (!targetId) {
      res.status(400).json(resTemplate.MISS_FIELD);
      return;
    }
    ChatRoomService.findOrCreatePersonalChat(user.id, targetId).then(
      (chatroomId) => {
        if (chatroomId) {
          res.json({
            conversactionId: chatroomId,
          });
        } else {
          res.status(404).json(resTemplate.DATABASE_ERROR);
        }
      }
    );
  }

  getUserAllChatrooms(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    ChatRoomService.getUserPersonalChatRooms(user.id).then((personalChats) => {
      for (var i = 0; i < personalChats.length; i++) {
        let pc = personalChats[i];
        pc.isGroupChat = false;
      }
      ChatRoomService.getUserGroupChatRooms(user.id).then((groupChats) => {
        for (var i = 0; i < groupChats.length; i++) {
          let gc = groupChats[i];
          gc.isGroupChat = true;
        }
        let result = personalChats.concat(groupChats);
        res.json(result);
      });
    });
  }

  getOneChatRoom(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    let chatroomId = req.params.conversactionId;

    if (!isUuid(chatroomId)) {
      res.status(400).send(chatroomId + " is not a valid UUID");
      return;
    }

    ChatRoomService.getChatRoom(user.id, chatroomId).then(
      (chatroom) => {
        if (chatroom) {
          res.json(chatroom);
        } else {
          res.status(500).json(resTemplate.DATABASE_ERROR);
        }
      }
    );
  }

  putMessage(req, res) {
    let user = req.body.user;
    if (!user) {
      res.status(403).json(resTemplate.TOKEN_ERR);
      return;
    }
    let message = req.body.message;
    let chatroomId = req.body.conversactionId;
    let isGroupChat = req.body.isGroupChat;
    if (!isUuid(chatroomId)) {
      res.status(400).send(chatroomId + " is not a valid UUID");
      return;
    }
    if (!message || message === "") {
      res.status(400).send("message is empty");
      return;
    }
    if (isGroupChat == undefined) {
      res.status(400).send("Must provide isGroupChat");
      return;
    }

    ChatRoomService.putMessage(user.id, isGroupChat, chatroomId, message).then(
      (result) => {
        if (result) {
          res.json(resTemplate.SUCCESS);
        } else {
          res.status(500).json(resTemplate.DATABASE_ERROR);
        }
      }
    );
  }
}

module.exports = new ChatRoomController();

var express = require("express");
var router = express.Router();

const ChatRoom = require("../controllers/chatRoomController");
const User = require("../controllers/userController");

router.get(
  "/conversaction/find/:userId",
  User.verifyToken,
  ChatRoom.findPersonalChatroom
)

router.get(
  "/conversaction/all",
  User.verifyToken,
  ChatRoom.getUserAllChatrooms
);

router.get(
  "/conversaction/get/:conversactionId",
  User.verifyToken,
  ChatRoom.getOneChatRoom
);

router.put(
  "/conversaction/message",
  User.verifyToken,
  ChatRoom.putMessage
);


module.exports = router;

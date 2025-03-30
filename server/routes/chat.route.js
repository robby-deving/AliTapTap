const express = require("express");
const { sendMessage, getMessages, getSendersByReceiver, getLatestMessage } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/messages/:senderId/:receiverId", getMessages);
router.get("/senders/:receiverId", getSendersByReceiver);
router.get('/latest/:senderId/:receiverId', getLatestMessage);

module.exports = router;

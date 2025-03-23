const express = require("express");
const { sendMessage, getMessages, getSendersByReceiver, getSendersWithLastMessage } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/messages/:senderId/:receiverId", getMessages);
router.get("/senders/:receiverId", getSendersByReceiver);
router.get("/senders-with-last-message/:userId", getSendersWithLastMessage);

module.exports = router;

const express = require("express");
const { sendMessage, getMessages, getSendersByReceiver } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/messages/:senderId/:receiverId", getMessages);
router.get("/senders/:receiverId", getSendersByReceiver);

module.exports = router;

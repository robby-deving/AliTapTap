const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:senderId/:receiverId", getMessages);

module.exports = router;

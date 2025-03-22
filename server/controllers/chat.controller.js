const mongoose = require("mongoose");
const Chat = require("../Models/chat.model"); // ✅ Use require instead of import

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Ensure IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    const messages = await Chat.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(senderId), receiverId: new mongoose.Types.ObjectId(receiverId) },
        { senderId: new mongoose.Types.ObjectId(receiverId), receiverId: new mongoose.Types.ObjectId(senderId) },
      ],
    }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: "No messages found between these users." });
    }

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages };

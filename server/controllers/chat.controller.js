const mongoose = require("mongoose");
const Chat = require("../Models/chat.model");
const User = require("../Models/user.model");

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

const getSendersByReceiver = async (req, res) => {
  try {
    const { receiverId } = req.params;

    // Validate receiverId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.log("Invalid receiver ID received:", receiverId);
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    // Find all messages where this receiverId is the recipient
    const messages = await Chat.find({ receiverId: new mongoose.Types.ObjectId(receiverId) }).select("senderId");

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found for this receiver." });
    }

    // Extract unique sender IDs
    const senderIds = [...new Set(messages.map(msg => msg.senderId.toString()))];

    // Fetch user details for the unique sender IDs
    const senders = await User.find({ _id: { $in: senderIds } }).select("name email"); // Adjust fields as needed

    res.status(200).json({ senders });
  } catch (error) {
    console.error("Error fetching senders:", error);
    res.status(500).json({ error: "Error fetching senders" });
  }
};

module.exports = { sendMessage, getMessages, getSendersByReceiver };

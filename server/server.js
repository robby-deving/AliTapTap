require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const dbConnection = require("./dbConnect/dbConnection");
const routes = require("./routes/routes");
const chatRoutes = require("./routes/chat.route"); // ✅ Import chat routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // ✅ Allow Expo & web access
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Define routes
app.use("/", routes);
app.use("/api/chat", chatRoutes); // ✅ Mount chat routes

// ✅ WebSocket Handling
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log(`📩 Message from ${socket.id}:`, msg);
    io.emit("message", msg); // ✅ Broadcast message to all clients
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ A user disconnected (${socket.id}) - Reason: ${reason}`);
  });

  socket.on("error", (err) => {
    console.error(`⚠️ WebSocket error (${socket.id}):`, err);
  });
});

// ✅ Start Server & Connect to Database
(async () => {
  try {
    await dbConnection();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // Exit on failure
  }
})();

// ✅ Handle Uncaught Errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

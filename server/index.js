const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // ✅ Allow all origins (For development only)
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("message", (msg) => {  // ✅ Match event name with client
    console.log("Received message:", msg);
    io.emit("message", msg); // ✅ Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

server.listen(port, () => console.log(`🚀 Server listening at port ${port}`));

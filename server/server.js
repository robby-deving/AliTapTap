require('dotenv').config();
const express = require("express");
const dbConnection = require("./dbConnect/dbConnection");
const cors = require('cors');
const http = require('http');  // Required for Socket.io
const socketIo = require('socket.io'); // Import Socket.io
const app = express();
const routes = require("./routes/routes");

const PORT = process.env.PORT || 4000;
app.use(cors({
    origin: '*', // Allow both Expo dev server and web
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server and pass it to Socket.io
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io with the server

// Add Socket.io to the app object so it can be accessed in controllers
app.set('io', io); 

app.use("/", routes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
});

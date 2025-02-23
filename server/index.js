const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('a user connected');
    
});

server.listen(port, () => console.log('Server listening at port ' + port));
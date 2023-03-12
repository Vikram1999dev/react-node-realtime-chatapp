const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app);

//instantiate the socket io server
const io = new Server(server, {
  cors: {
    //which server is calling to make socket.io connection
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

//takes a 'socket' parameter, which represents the newly-connected client.
io.on('connection', (socket) => {
  // the client's unique socket ID is logged to the console using socket.id.
  //This ID can be used to uniquely identify the client and track their activity on
  //the server.
  console.log(`User Connected ${socket.id}`);

  // The callback function takes a parameter "data", which is the name of the room that
  // the user wants to join. The function then uses the socket.join method to add
  // the socket to the specified room, and logs a message to the console indicating
  // that the user with the given socket ID has joined the room.
  //
  // By joining a specific room, the client can receive updates and messages
  // related to that room only.
  //-->01
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //-->02
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  //This listener is executed when the client disconnects from the server
  //(e.g. due to closing the browser tab or losing network connectivity).
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Listening on port 3001');
});

require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const server = http.listen(PORT, () =>
  console.log(`server is runing on PORT ${PORT}...`)
);

let rooms = [];

const addRoom = (name) => {
  !rooms.some((room) => room === name) && rooms.push(name);
};

io.on('connection', (socket) => {
  socket.on('getAllRooms', () => {
    io.emit('getAllRooms', rooms);
  });

  //createRoom
  socket.on('createGame', (roomId) => {
    addRoom(roomId, socket.id);
    socket.join(roomId);
    io.emit('getAllRooms', rooms);

    //to get the number of clients in this room
    const clients = io.sockets.adapter.rooms.get(roomId);
  });

  //join Game
  socket.on('joinGame', ({ roomId, user }) => {
    socket.join(roomId);

    mapObject = io.sockets.adapter.rooms; // return Map Js Object
    clientsInRoom = new Set(mapObject.get(roomId));

    const socketClients = [];
    const [first] = clientsInRoom;
    socketClients.push(first);
    const [, second] = clientsInRoom;
    socketClients.push(second);

    socket.on('sendPlayers', (allPlayers) => {
      io.in(roomId).emit('startGame', {
        clients: socketClients,
        decks: allPlayers,
        roomId: roomId,
        User: user
      });
    });
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i] == roomId) {
        rooms.splice(i, 1);
      }
    }

    io.emit('updatedLobby', rooms);
  });

  socket.on('leftHit', ({ player, room, turn }) => {
    io.in(room).emit('leftData', { player, turn });
  });
  socket.on('RightHit', ({ player, room, wallet, pc }) => {
    io.in(room).emit('RightHit', { player, room, wallet, pc });
  });

  socket.on('LeftWinner', ({ state, whowin, room }) => {
    io.in(room).emit('LeftWinner', { state, whowin });
  });
  //when disconnect
  socket.on('disconnect', () => {
    io.emit('playerLeave', socket.id);
  });
});

module.exports = server;

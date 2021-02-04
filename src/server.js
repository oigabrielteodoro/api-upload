const express = require('express');
const socketio = require('socket.io');

const cors = require('cors');

const http = require('http');

const uploadConfig = require('./config/upload');
 
const routes = require('./routes');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
 
  io.on('disconnect', () => {
    delete connectedUsers[user_id];
  });
});
 
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/files', express.static(uploadConfig.uploadsFolder));
 
app.use((req, _, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  next();
})

app.use(routes);

server.listen(3333, () => {
  console.log('Server started');
}); 
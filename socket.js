const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let t = Math.PI / 2;

const loc = {
  lng: Number(29.0267115), // lovely place
  lat: Number(41.0838953),
};
const startSocket = () => {
  http.listen(3000, () => {
    console.log('listening on *:3000');
  });
  io.on('connection', (socket) => {
    console.log('client connected');
    socket.on('disconnect', () => {
      io.sockets.emit('broadcast', loc);
    });
    setInterval(() => {
      const r =
        Math.sin(t) * Math.sqrt(Math.abs(Math.cos(t))) / (Math.sin(t) + 1.4) - 2 * Math.sin(t) + 2;
      t += 0.1;
      const tloc = {
        lat: loc.lat + 0.1 * r * Math.sin(t),
        lng: loc.lng + 0.1 * r * Math.cos(t),
      };
      io.sockets.emit('broadcast', tloc);
    }, 1000);
  });
};

module.exports = startSocket;

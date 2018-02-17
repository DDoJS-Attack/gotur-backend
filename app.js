const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const firebase = require('./helpers/firebase');
const db = require('./helpers/db');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const schedule = require('node-schedule');

http.listen(3000, () => {
  console.log('listening on *:3000');
});
const loc = {
  lat: Number(29.01814899999999),
  lon: Number(41.071823),
};
io.on('connection', (socket) => {
  io.sockets.emit('broadcast', loc);
  socket.on('disconnect', () => {
    io.sockets.emit('broadcast', 'hayda');
  });
});
// Load the variables in .env file to the process.env
dotenv.config();
// const cache = require('./helpers/redis');

// Connect to the db and listen if success
db
  .connect()
  .on('error', console.error)
  .on('disconnected', db.connect)
  .once('open', () => {
    app.listen(process.env.APP_PORT);
    console.log(`Listening on port: ${process.env.APP_PORT}`);
  });

// Configure Middlewares
app.use(morgan(process.env.LOGGING_LEVEL || 'tiny'));
app.use(bodyParser.json());

// Configure Routes
app.use('/', require('./routes/index'));
app.use('/customer', require('./routes/customer'));
app.use('/courier', require('./routes/courier'));
app.use('/cargo', require('./routes/cargo'));

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  }
  res.json({
    code: err.alias,
    message: err.message,
    messages: err.messages,
  });
  next(err);
});

setInterval(() => {
  loc.lat += 0.001;
  loc.lon += 0.001;
  console.log(loc);
  io.sockets.emit('broadcast', loc);
}, 5000);

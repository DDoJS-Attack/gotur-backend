const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const db = require('./helpers/db');

const app = express();

// Load the variables in .env file to the process.env
dotenv.config();

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
app.use('/courier', require('./routes/courrier'));

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

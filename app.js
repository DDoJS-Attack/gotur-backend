const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const db = require('./helpers/db');

const app = express();
const test = require('./models/customer');

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
    // test.create({ name: 'sah1n', phoneNum: 15215145, cargos: [123, 123, 44, 123] });
    // test.findCargosOfCustomer('5a875fc0d26ea866b9b837b7').then(x => console.log(x));
  });

// Configure Middlewares
app.use(morgan(process.env.LOGGING_LEVEL || 'tiny'));
app.use(bodyParser.json());

// Configure Routes
app.use('/', require('./routes/index'));
app.use('/customer', require('./routes/customer'));

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

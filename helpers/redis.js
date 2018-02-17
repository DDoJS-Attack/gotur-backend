const host = 'localhost';
const port = 6379;
const authPass = 12345678;

const cache = require('express-redis-cache')({
  host,
  port,
  authPass,
  expire: 60,
});

module.exports = cache;

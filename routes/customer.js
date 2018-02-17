const express = require('express');

const router = express.Router();
const Customer = require('../models/customer');

router.get('/', (req, res) => {
  query = { ...req.query };
  res.sendStatus(200);
});

router.get('/my', (req, res) => {});
module.exports = router;

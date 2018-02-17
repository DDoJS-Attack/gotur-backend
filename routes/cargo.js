const express = require('express');

const Cargo = require('../models/cargo.js');

const Schema = require('mongoose').Schema;

const router = express.Router();

const filterBuilder = (req, res, next) => {
  req.dbquery = {};
  if (req.body.ids) req.dbquery._id = { $in: req.body.ids.map(Schema.Types.ObjectId) };
  if (req.body.status) req.dbquery.Status = { $in: req.body.status };
  if (req.body.near) {
    const latitude = Number(req.body.near.latitude);
    const longitude = Number(req.body.near.longitude);
    const radius = Number(req.body.near.radius);
    if (latitude && longitude && radius) {
      req.dbquery.SourceLoc = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      };
    }
  }

  next();
};
router.use(filterBuilder);
router.post('/', (req, res) => {
  Cargo.find(req.dbquery)
    .then(data => res.json({ status: 0, data }).end())
    .catch((err) => {
      res
        .status(404)
        .json({ status: 404, msg: 'could not found', err })
        .end();
    });
});

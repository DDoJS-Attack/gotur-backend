const express = require('express');

const Cargo = require('../models/cargo.js');

const Schema = require('mongoose').Schema;

const router = express.Router();

const isNumber = x => !isNaN(x) && isFinite(x);

const queryBuilder = (req, res, next) => {
  req.dbquery = {};
  if (req.body.owner) req.dbquery.Owner = req.body.owner;
  if (req.body.courrier) req.dbquery.Courrier = req.body.courrier;
  if (req.body.ids) req.dbquery._id = { $in: req.body.ids.map(Schema.Types.ObjectId) };
  if (req.body.status) req.dbquery.Status = { $in: req.body.status };
  if (req.body.near) {
    const latitude = Number(req.body.near.latitude);
    const longitude = Number(req.body.near.longitude);
    const radius = Number(req.body.near.radius);
    if (isNumber(latitude) && isNumber(longitude) && isNumber(radius)) {
      req.dbquery.SourceLoc = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      };
    }
  }

  next();
};

router.use(queryBuilder);

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

router.get('/:id', (req, res) => {
  Cargo.findById(req.params.id)
    .then(data => res.json({ status: 0, data }))
    .catch(err => res.status(404).json({ status: 404, msg: 'Cargo not found', err }));
});

module.exports = router;

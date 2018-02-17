const express = require('express');

const Courier = require('../models/courier.js');
const Cargo = require('../models/cargo.js');
const Customer = require('../models/customer.js');

const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  res.json({ status: 'success', msg: 'not implemented yet' }).end();
});

router.post('/', (req, res) => {
  const newCourier = {
    name: req.body.name,
    phone: req.body.phone,
    cargos: [],
  };
  Courier.create(newCourier)
    .then(x => res.json({ status: 'success', msg: 'courier created' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: 'could not create courier', err })
        .end());
});

router.get('/my', (req, res) => {
  Cargo.find({ Courier: req.query.courier_id })
    .then(data => res.json({ status: 0, data }).end())
    .catch(err =>
      res
        .status(404)
        .json({ status: 404, err })
        .end());
});

router.get('/my/:id', (req, res) => {
  Cargo.findById(req.params.id)
    .then(c => res.json({ status: 0, data: c }).end())
    .catch((err) => {
      res
        .status(500)
        .json({ status: 404, err })
        .end();
    });
});

router.post('/own', (req, res) => {
  console.log(req.body);
  Courier.own(req.body.courier_id, req.body.cargo_id)
    .then(x =>
      Cargo.Cargo.findByIdAndUpdate(req.body.cargo_id, {
        Courier: req.body.courier_id,
        OwnTime: Date.now(),
      }))
    // .then( ) send notification to customer: cargo owned by a courier
    .then(x => res.json({ status: 0, msg: 'owned cargo' }).end())
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ status: 500, msg: 'cannot own cargo', err })
        .end();
    });
});

router.post('/pick', (req, res) => {
  Cargo.Cargo.findByIdAndUpdate(req.body.cargo_id, {
    Status: 'OnWay',
    PickTime: Date.now(),
  })
    // .then( ) send notification: cargo picked by the courier
    .then(x => res.json({ status: 0, msg: 'picked cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});

router.post('/deliver', (req, res) => {
  Cargo.Cargo.findByIdAndUpdate(req.body.cargo_id, {
    Status: 'Delivired',
    DeliverTime: Date.now(),
  })
    // .then( ) send notification: cargo picked by the courier
    .then(x => res.json({ status: 0, msg: 'picked cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});
router.get('/:id', (req, res) => {
  Courier.findById(req.params.id)
    .then(c => res.json({ status: 0, data: c }).end())
    .catch(err =>
      res
        .status(404)
        .json({ status: 404, err })
        .end());
});
module.exports = router;

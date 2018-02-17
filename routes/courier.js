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
  Courier.create({
    name: req.body.name,
    phone: req.body.phone,
    cargos: [],
  })
    .then(() => res.json({ status: 'success', msg: 'courier created' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: 'could not create courier', err })
        .end());
});
/*
router.get('/my', (req, res) => {
  Cargo.find({ Courier: req.params.courier_id })
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
*/

router.post('/own', (req, res) => {
  console.log(req.body);
  let cour;
  Courier.findById(req.body.courierId)
    .then((c) => {
      cour = c;
      cour.cargos.push(req.body.cargoId);
      return Cargo.ownCargo(req.body.cargoId, req.body.cargoId);
    })
    .then(() => cour.save())
    .then(x => x) // TODO send notif
    .then(() => res.json({ status: 0, msg: 'owned cargo' }))
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: 'cannot own cargo', err })
        .end());
});

router.post('/pick', (req, res) => {
  Cargo.updateStatus(req.body.cargoId, 'ONWAY')
    .then(x => x) // send notification: cargo picked by the courier
    .then(() => res.json({ status: 0, msg: 'picked cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});

router.post('/deliver', (req, res) => {
  Cargo.updateStatus(req.body.cargoId, 'DELIVERY')
    // .then( ) send notification: cargo picked by the courier
    .then(() => res.json({ status: 0, msg: 'picked cargo' }).end())
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

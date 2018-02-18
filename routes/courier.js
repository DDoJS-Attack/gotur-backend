const express = require('express');

const Courier = require('../models/courier.js');
const Cargo = require('../models/cargo.js');
const Customer = require('../models/customer.js');

const router = express.Router();
const mongoose = require('mongoose');
const cache = require('express-redis-cache')({ port: 6379, expire: 75, prefix: 'courier' });

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

router.post('/own', (req, res) => {
  let cour;
  // let cargoName; just take name of the cargo for firebase notification messsage
  Courier.findById(req.body.courierId)
    .then((c) => {
      cour = c;
      cour.cargos.push(req.body.cargoId);
      return Cargo.ownCargo(req.body.cargoId, req.body.cargoId);
    })
    .then(() => cour.save())
    // .then(() => {
    // firebase.sendMsg(`Courier ${cour.name} assigned to your cargo!`);
    // }) // TODO send notif
    .then(() => res.json({ status: 0, msg: 'owned cargo' }))
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: 'cannot own cargo', err })
        .end());
});
router.post('/pick', (req, res) => {
  Cargo.updateStatus(req.body.cargoId, Cargo.StatusEnum.ONWAY)
    .then(x => x) // TODO send notification: cargo picked by the courier
    .then(() => res.json({ status: 0, msg: 'picked cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});
router.post('/deliver', (req, res) => {
  Cargo.updateStatus(req.body.cargoId, Cargo.StatusEnum.DELIVERY)
    // .then( ) TODO send notification: cargo delivired by the courier
    .then(() => res.json({ status: 0, msg: 'delivired cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});
router.post('/relase', (req, res) => {
  Cargo.relaseCargo(req.body.cargoId)
    // .then( ) TODO send notification: cargo released by the courier
    .then(() => res.json({ status: 0, msg: 'released cargo' }).end())
    .catch(err =>
      res
        .status(500)
        .json({ status: 500, msg: err })
        .end());
});
router.get('/:id', cache.route({ type: 'application/javascript' }), (req, res) => {
  Courier.findById(req.params.id)
    .then(c => res.json({ status: 0, data: c }).end())
    .catch(err =>
      res
        .status(404)
        .json({ status: 404, err })
        .end());
});
module.exports = router;

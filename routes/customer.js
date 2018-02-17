const express = require('express');

const router = express.Router();
const Customer = require('../models/customer');
const Cargo = require('../models/cargo');
const mongoose = require('mongoose');
// const cache = require('../helpers/redis');
// Return the customer info
router.get('/', (req, res) => {
  Customer.Customer.findById(req.params.id)
    .then(x => res.send(x))
    .catch(err => res.sendStatus(400));
});

// TODO! Optimize it.
router.get('/my', async (req, res) => {
  try {
    const payload = { status: 0, cargos: [] };
    payload.cargos = await Cargo.find({ customer: req.query.id });

    res.send(payload);
  } catch (err) {
    res
      .status(400)
      .json({ status: 400, msg: `cannot find ${req} 's cargos` })
      .end();
  }
});
// Get cargo of specific customer
router.get('/my/:id', async (req, res) => {
  try {
    const cargos = await Cargo.Cargo.findById(req.params.id);
    const payload = { status: 0, cargos };

    res.send(payload);
  } catch (err) {
    res
      .status(400)
      .json('Probably this user does not exist')
      .end();
  }
});

// Create a new cargo
router.post('/create', async (req, res) => {
  try {
    const body = { ...req.body };
    const cargo = await Cargo.create(body);
    await Customer.addCargo({ cargoId: cargo._id, ownerId: body.customer });
    res
      .status(200)
      .json({ msg: 'Success', status: 0 })
      .end();
  } catch (err) {
    res.status(400).send('Invalid options');
  }
});

// Delete cargo of customer
router.delete('/deleteCargo', async (req, res) => {
  const body = { ...req.body };
  Promise.all(Customer.deleteCargo(body.customerId, body.cargoId), Cargo.remove(req.body.cargoId))
    .then(() => res.send({ status: 0 }))
    .catch((err) => {
      res.status(400).json('Cannot delete');
    });
});
// Create customer
router.post('/createCustomer', async (req, res) => {
  const body = { ...req.body };
  try {
    await Customer.create(body);
    res.status(200).json({ msg: 'success', status: 0 }).end();
  } catch (err) {
    res.sendStatus(400);
  }
});
module.exports = router;

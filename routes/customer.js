const express = require('express');

const router = express.Router();
const Customer = require('../models/customer');
const Cargo = require('../models/cargo');
const mongoose = require('mongoose');

// Return the customer info
router.get('/', (req, res) => {
  Customer.Customer.findById(req.params.id)
    .then(x => res.send(x))
    .catch(err => res.sendStatus(400));
});

// TODO
router.get('/my', async (req, res) => {
  try {
    const cargoIds = await Customer.findCargosOfCustomer(req.query.id);
    // console.log(cargoIds, req.query.id);
    // console.log(cargoIds.map(x => mongoose.Types.ObjectId(x)));

    const payload = { status: 0, cargos: [] };
    // payload.cargos = Cargo.Cargo.find({
    //   _id: { $in: cargoIds.map(x => mongoose.Types.ObjectId(x)) },
    // }).then(x => res.send(x));
    Cargo.Cargo.find({ _id: req.query.id }).then(x => x);

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
    await Customer.addCargo({ cargoId: cargo._id, ownerId: body.Owner });
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
  Promise.all(Customer.deleteCargo(body), Cargo.remove(req.body.cargoId))
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
  } catch (err) {
    res.sendStatus(400);
  }
});
module.exports = router;

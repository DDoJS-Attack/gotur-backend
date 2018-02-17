const express = require('express');

const router = express.Router();
const Customer = require('../models/customer');
const Cargo = require('../models/cargo');

router.get('/', async (req, res) => {
  const query = { ...req.query };
  console.log(query);
  res.sendStatus(200);
});

router.get('/my', async (req, res) => {
  try {
    const cargoIds = await Customer.findCargosOfCustomer(req.query.id);
    const payload = { status: 200, cargos: [] };
    payload.cargos
      .push(Promise.all(cargoIds.map(id => Cargo.findById(id))))
      .catch(res.sendStatus(400));
    res.send(payload);
  } catch (err) {
    res.sendStatus(400);
  }
});
router.get('/my/:id', async (req, res) => {
  try {
    const cargos = await Cargo.Cargo.findById(req.params.id);
    const payload = { status: 200, cargos };

    res.send(payload);
  } catch (err) {
    res.sendStatus(400);
  }
});
router.post('/create', async (req, res) => {
  try {
    const body = { ...req.body };
    await Customer.create(body);
    res.send({ status: 200 });
  } catch (err) {
    console.err(err);
    res.sendStatus(400);
  }
});
router.delete('/deleteCargo', async (req, res) => {
  const body = { ...req.body };
  Promise.all(Customer.deleteCargo(body), Cargo.delete())
    .then(() => res.send({ status: 200 }))
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});
module.exports = router;

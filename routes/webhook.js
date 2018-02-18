const express = require('express');

const router = express.Router();
// Deep learningten düştüğümüz duruma gel xd
const Facebook = require('../helpers/facebook');
const redis = require('redis');
const Customer = require('../models/customer');
const Cargo = require('../models/cargo');
const mongoose = require('mongoose');
// Yeah, we're using redis
const client = redis.createClient(6379);

// Helpers for not to fall in callback hell
const getCurrState = (key, cb) => client.get(key, cb);
const setState = (key, val, cb) => client.set(key, val, cb);
// Update: Redis functions does not accept promises as cb lol

// Some credential infomation
const dbUser = '5a89192504f38311125a5523';
const cargoBody = {
  sourceAddress: 'chatbot',
  destinationAddress: 'geldi',
  customer: dbUser,
  price: 1,
  weight: 3,
};

// THAT REALLY NEEDS TO BE REFACTORED

router.post('/', (req, res) => {
  const body = { ...req.body };
  if (body.object === 'page') {
    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging[0];
      // console.log(webhookEvent);
      const userId = webhookEvent.sender.id;

      // Lets recap our Automata theory knowledge
      if (webhookEvent.postback) {
        if (webhookEvent.postback.payload === 'ADD_CARGO') {
          Facebook.sendButton(userId, 'Kargonun alınacağı konumu girin').then(setState(userId, 4));
        } else if (webhookEvent.postback.payload === 'REMOVE_CARGO') {
          try {
            const l = await Customer.findCargosOfCustomer(dbUser);
            Facebook.sendList(userId, l).then(setState(userId, 2));
          } catch (err) {
            Facebook.sendTextMessage(userId, 'Error occured');
          }
        } else if (webhookEvent.postback.payload === 'LIST_CARGO') {
          try {
            const l = await Customer.findCargosOfCustomer(dbUser);
            Facebook.sendList(userId, l);
            setState(userId, 0);
          } catch (err) {
            Facebook.sendTextMessage(userId, 'Error occured');
          }
        } else {
          const cargoId = webhookEvent.postback.title;
          Customer.deleteCargo(dbUser, cargoId)
            .then(Cargo.remove(mongoose.Types.ObjectId(cargoId)))
            .then(() => res.send({ status: 0 }))
            .catch((err) => {
              Facebook.sendTextMessage(userId, 'Error occured');
            });
        }
      } else if (webhookEvent.message) {
        getCurrState(userId, async (err, val) => {
          if (err) {
            console.error(err);
          } else if (val === null) {
            Facebook.sendMenu(userId);
            setState(userId, 0);
          } else if (val == 0) {
            Facebook.sendMenu(userId);
          } else if (val == 1) {
            client.get(`${userId}coor1`, (err, val) => {
              client.get(`${userId}coor2`, (err2, val2) => {
                setState(userId, 0);
                Facebook.sendTextMessage(
                  userId,
                  `Successfully added cargo from${val}to${val2}`,
                ).then(Cargo.create({
                  ...cargoBody,
                  name: webhookEvent.message.text,
                  sourceLoc: val.split(',').map(x => parseFloat(x)),
                  destinationLoc: val2.split(',').map(x => parseFloat(x)),
                })
                  .then((cargo) => {
                    Customer.addCargo({
                      cargoId: cargo._id,
                      ownerId: dbUser,
                    });
                  })
                  .catch(Facebook.sendTextMessage(userId, 'Error occured')));
              });
            });
          } else if (val == 2) {
            // User only can select an id to remove
            setState(userId, 0);
            Facebook.sendTextMessage(userId, 'Ne dedigini anlamadım').then(Facebook.sendMenu(userId));
          } else if (val == 3) {
            const l = await Customer.findCargosOfCustomer(dbUser);
            Facebook.sendList(userId, l);
          } else if (val == 4) {
            // Take 1st location
            const coordinates = webhookEvent.message.attachments[0].payload.coordinates;
            client.set(`${userId}coor1`, [coordinates.lat, coordinates.long].toString());
            Facebook.sendButton(userId, 'gönderilecek konumu gönderin').then(setState(userId, 5));
          } else if (val == 5) {
            // Take 2nd location
            const coordinates = webhookEvent.message.attachments[0].payload.coordinates;
            client.set(`${userId}coor2`, [coordinates.lat, coordinates.long].toString());
            Facebook.sendTextMessage(userId, 'Aciklama giriniz').then(setState(userId, 1));
          }
        });
      }
    });
    res
      .status(200)
      .send('EVENT_RECEIVED')
      .end();
  } else {
    res.send(400);
  }
});
router.get('/', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res
        .status(200)
        .send(challenge)
        .end();
    } else {
      // Responds with '403 ForbuserIdden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

module.exports = router;

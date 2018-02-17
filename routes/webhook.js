const express = require('express');

const router = express.Router();
// Deep learningten düştüğümüz duruma gel xd
const Facebook = require('../helpers/facebook');
const redis = require('redis');
const Customer = require('../models/customer');

const client = redis.createClient(6379);

// Helpers for not to fall in callback hell
const getCurrState = (key, cb) => client.get(key, cb);
const setState = (key, val, cb) => client.set(key, val, cb);

router.post('/', (req, res) => {
  const body = { ...req.body };
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      const userId = webhookEvent.sender.id;
      if (webhookEvent.postback) {
        if (webhookEvent.postback.payload === 'ADD_CARGO') {
          Facebook.sendButton(userId, 'Kargonun alınacağı konumu girin').then(setState(userId, 4));
          const coordinates = webhookEvent.message.attachments[0].payload.coordinates;
          client.set(
            `${userId}coor2`,
            [coordinates.lat, coordinates.long].toString(),
            setState(userId, 4),
          );
        } else if (webhookEvent.postback.payload === 'REMOVE_CARGO') {
          Facebook.sendList(
            userId,
            Customer.Customer.findById('5a884c04947e116eed78b2f7').then(data => data.cargos),
          );
        } else if (webhookEvent.postback.payload === 'LIST_CARGO') {
          Facebook.sendList(
            userId,
            Customer.Customer.findById('5a884c04947e116eed78b2f7').then(data => data.cargos),
          );
        } else {
          console.log(webhookEvent.postback.title);
          Customer.Customer.findById(userId).then((data) => {
            data.cargos.push(webhookEvent.postback.title);
            data.save();
          });
        }
      } else if (webhookEvent.message) {
        getCurrState(userId, (err, key) => {
          if (err) {
            console.error(err);
          } else if (key === null) {
            Facebook.sendMenu(userId).then(x => console.log('geldi'));
            setState(userId, 0);
          } else if (key == 0) {
            Facebook.sendMenu(userId);
          } else if (key == 1) {
            setState(
              userId,
              0,
              Facebook.sendTextMessage(userId, 'Ne dedigini anlamadım').then(Facebook.sendMenu(userId)),
            );
          } else if (key == 2) {
            setState(
              userId,
              0,
              Facebook.sendTextMessage(userId, 'Ne dedigini anlamadım').then(Facebook.sendMenu(userId)),
            );
          } else if (key == 3) {
            // sendd list
            Facebook.sendList(
              userId,
              Customer.Customer.findById('5a884c04947e116eed78b2f7').then(data => data.cargos),
            );
          } else if (key == 4) {
            // Take 2nd location
            const coordinates = webhookEvent.message.attachments[0].payload.coordinates;
            console.log(coordinates, 'buradayız');
            client.set(`${userId}coor2`, [coordinates.lat, coordinates.long].toString());

            Facebook.sendButton(userId, 'gönderilecek konumu gönderin').then(setState(userId, 5));
          } else if (key == 5) {
            console.log(webhookEvent.message.text);
          }
        });

        // Facebook.sendTextMessage(userId, webhookEvent.message.text);
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

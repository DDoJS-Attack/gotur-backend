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
        } else if (webhookEvent.postback.payload === 'REMOVE_CARGO') {
          Facebook.sendList(userId);
        } else if (webhookEvent.postback.payload === 'LIST_CARGO') {
          Facebook.sendList(userId);
        } else {
          console.log(webhookEvent.postback.title);
        }
      } else if (webhookEvent.message) {
        getCurrState(userId, (err, key) => {
          console.log(typeof key);
          if (err) {
            throw err;
          } else if (key === null) {
            Facebook.asd(userId).then(x => console.log('geldi'));
            setState(userId, 0);
            
          } else if (key == 0) {
            // Show menu
            Facebook.asd(userId);
          } else if (key == 1) {
            // Send first location prompt
            console.log(webhookEvent);
          } else if (key == 2) {
            // Send clickable list
            console.log(webhookEvent);
          } else if (key == 3) {
            // sendd list
            Facebook.sendTextMessage(userId, 'Kargoların...');
          } else if (key == 4) {
            // Take 2nd location
            Facebook.sendButton(userId, 'gönderilecek konumu gönderin').then(setState(userId, 5));
          } else if (key == 5) {
            // Take desc
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

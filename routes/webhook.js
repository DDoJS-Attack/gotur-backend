const express = require('express');

const router = express.Router();
// Deep learningten düştüğümüz duruma gel xd
const Facebook = require('../helpers/facebook');
const redis = require('redis');
const client = redis.createClient()

router.post('/', (req, res) => {
  const body = { ...req.body };
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      if (webhookEvent.postback) {
        console.log('butona basıldı onun lojiği var');
      } else if (webhookEvent.message) {
        console.log('yazı yazıldı lojiği', webhookEvent.message.text, webhookEvent.recipient.id);
        Facebook.sendTextMessage(webhookEvent.sender.id, webhookEvent.message.text);
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
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

module.exports = router;

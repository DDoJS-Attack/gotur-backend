const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (process.env.VERIFY_TOKEN !== req.query.verify_token) {
    res.sendStatus(404).end();
  } else {
    res.send('Root').end();
  }
});


module.exports = router;

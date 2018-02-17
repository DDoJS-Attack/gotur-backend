const admin = require('firebase-admin');

const serviceAccount = require('../../gotur-app-firebase-adminsdk-tkymu-aeea0eb2a6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gotur-app.firebaseio.com',
});
const messaging = admin.messaging();
const message = {
  notification: {
    title: '$GOOG up 1.43% on the day',
    body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
  },
  topic: 'all',
};

messaging
  .send(message)
  .then(x => console.log(x))
  .catch(err => console.error(err));

module.exports = { sendMsg: msg => messaging(msg) };

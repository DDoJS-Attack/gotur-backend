const firebase = require('firebase');

module.exports = () => {
  const apiKey = process.env.FIREBASE_API_KEY;
  const authDomain = process.env.FIREBASE_AUTH_DOMAIN;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  const config = {
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
  };

  const defaultApp = firebase.initializeApp(config);
  console.log(defaultApp.name); // "[DEFAULT]"
  return firebase;
};

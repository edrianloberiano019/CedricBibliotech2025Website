const admin = require("firebase-admin");
const serviceAccount = require("./bibliotech-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bibliotech-9c6ce.firebaseio.com",
});


module.exports = admin;

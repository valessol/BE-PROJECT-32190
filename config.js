var admin = require("firebase-admin");

var serviceAccount = require("./be-ch-29b22-firebase-adminsdk-b53ev-c79ad14275");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://be-ch-29b22.firebaseio.com",
});

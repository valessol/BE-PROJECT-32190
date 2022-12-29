import { initializeApp } from "firebase-admin/app";
//const serviceAccount = require("./be-ch-29b22-firebase-adminsdk-b53ev-c79ad14275");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://be-ch-29b22.firebaseio.com",
// });

// async function CRUD() {}

class ContenedorFirebase {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.query;
  }

  initializeDBServer() {
    initializeApp({
      //credential: admin.credential.cert(serviceAccount),
      credential: applicationDefault(),
      databaseURL: "https://be-ch-29b22.firebaseio.com",
    });
    //CRUD();
  }

  createCollection() {
    const db = admin.firestore();
    const query = db.collection(this.collectionName);
    this.query = query;
  }

  async createDocument(data) {
    if (this.query) {
      try {
        let doc = this.query.doc();
        await doc.create(data);
        console.log("Document CREATED");
      } catch (error) {
        console.log(error);
      }
    } else console.log("can't found query");
  }

  readCollection() {
    this.query
      .get()
      .then((snapshot) => {
        console.log("READ");
        return snapshot;
      })
      .catch((err) => console.log(err));
  }

  filterCollection(filter) {
    this.query
      .where(...filter)
      .get()
      .then((snapshot) => {
        console.log("READ");
        return snapshot;
      })
      .catch((err) => console.log(err));
  }

  updateDocuments(filter, newValue) {
    // filter = [key, operator, value] as filter options
    const [key, operator, value] = filter;
    this.query
      .where(key, operator, value)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({ ...newValue });
        });
        console.log("UPDATE");
      })
      .then(() => {
        this.filterCollection(filter);
      })
      .catch((err) => console.log(err));
  }

  deleteDocument(filter) {
    const [key, operator, value] = filter;
    this.query
      .where(key, operator, value)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("DELETE");
      })
      .then(() => {
        this.filterCollection(filter);
      })
      .catch((err) => console.log(err));
  }
}

export default ContenedorFirebase;

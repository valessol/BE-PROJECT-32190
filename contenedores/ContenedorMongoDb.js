import mongoose from "mongoose";
import { config } from "dotEnv";
config();
const MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL;

async function CRUD(databaseUrl) {
  await mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Conectado a MongoDB");
}

class ContenedorMongoDb {
  constructor(database, name, schema) {
    this.databaseUrl = `${MONGO_DATABASE_URL}${database}?retryWrites=true&w=majority`;
    this.collectionName = name;
    this.schema = schema;
    this.collections = [];
  }

  initializeDBServer() {
    CRUD(this.databaseUrl);
  }

  createSchema() {
    return new mongoose.Schema({ ...this.schema });
  }

  findCollection(name) {
    return this.collections.find((collection) => collection.name === name)
      .Collection;
  }

  async createCollection(name) {
    const collectionSchema = await this.createSchema(this.schema);
    const Collection = await mongoose.model(name, collectionSchema);
    this.collections = [
      ...this.collections,
      { name, Collection, schema: collectionSchema },
    ];
    return Collection;
  }

  // create documents
  async uploadElement(docs) {
    /* docs can be object or array */
    const Collection = this.findCollection(this.collectionName);
    if (Array.isArray(docs)) await Collection.insertMany(docs);
    else await Collection.insertOne(docs);
    console.log("CREATE");
    return { message: "success", code: 201 };
  }

  // read collection
  async getAllElements() {
    const Collection = this.findCollection(this.collectionName);
    const data = await Collection.find();
    console.log("READ");
    return { message: "success", code: 201, data: data };
  }

  async findElementById(id) {
    const Collection = this.findCollection(this.collectionName);
    const data = await Collection.find();
    if (data.length) {
      const element = data.find((el) => el.id === id);
      if (element) {
        return {
          message: "success",
          code: 200,
          data: element,
        };
      } else return { message: "element not found", code: 404 };
    } else return { message: "empty data", code: 404 };
  }

  // update documents
  async updateElementById(id, options) {
    const { filter, value } = options;
    const Collection = this.findCollection(this.collectionName);
    await Collection.updateMany({ ...filter }, { ...value });
    console.log("UPDATE");
  }

  async deleteDocument(name, filter = {}) {
    const Collection = this.findCollection(name);
    await Collection.deleteMany({ ...filter });
    console.log("DELETE");
  }

  async deleteAllDocuments(name) {
    const Collection = this.findCollection(name);
    await Collection.deleteMany({});
    console.log("DELETE");
  }
}

export default ContenedorMongoDb;

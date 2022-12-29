import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";
import { productsSchema } from "../../utils/constants.js";

class ProductosDaoMongoDb extends ContenedorMongoDb {
  constructor(database, name, schema) {
    super(database, name, schema);
  }

  async addCollection() {
    await this.initializeDBServer();
    await this.createCollection(this.collectionName);
  }
} //clase 19 43'

export default ProductosDaoMongoDb;

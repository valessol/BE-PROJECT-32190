import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";

class ProductosDaoFirebase extends ContenedorFirebase {
  constructor() {
    super();
  }

  async addCollection() {
    await this.initializeDBServer();
    await this.createCollection("products");
  }
}

export default ProductosDaoFirebase;

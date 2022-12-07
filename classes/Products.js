const fs = require("fs");
const data = require("../data/products.json");
const isStatus200 = require("../helpers");

class Product {
  constructor() {
    this.file = data;
  }

  getAllProducts() {
    return this.file.length
      ? { message: "productos obtenidos con éxito", code: 200, data: this.file }
      : { message: "No hay productos", code: 200, data: [] };
  }

  getProductById(id) {
    if (isNaN(id)) {
      return { message: "id inválido", code: 400 };
    } else if (this.file && this.file.length) {
      const product = this.file.find((product) => product.id === id);
      if (product)
        return {
          message: "producto obtenido con éxito",
          code: 200,
          data: product,
        };
      else return { message: "producto no encontrado", code: 404 };
    } else return { message: "No hay productos", code: 404, data: [] };
  }

  getProductId() {
    let id;
    if (!this.file.length) {
      id = 1;
    } else {
      const ids = this.file.map((product) => product.id);
      id = Math.max(...ids) + 1;
    }
    return id;
  }

  async uploadProduct(product) {
    if (product) {
      const id = this.getProductId();
      const productToUpload = {
        ...product,
        id,
        codigo: id,
        timestamp: Date.now(),
      };
      this.file = [...this.file, productToUpload];
      const response = await fs.promises
        .writeFile(`./data/products.json`, JSON.stringify(this.file, null, 2))
        .then((res) => {
          return { message: "producto añadido con èxito", code: 201 };
        })
        .catch((err) => {
          return {
            message: `el producto no se ha podido guardar, ${err}`,
            code: 500,
          };
        });
      return isStatus200(response.code)
        ? { ...response, data: productToUpload }
        : response;
    }
  }

  async updateProduct(id, product) {
    const productToUpdate = this.file.find((product) => product.id === id);
    if (productToUpdate && productToUpdate.id) {
      const filteredProducts = this.file.filter((item) => item.id !== id);
      this.file = [...filteredProducts, { ...productToUpdate, ...product }];
      const response = await fs.promises
        .writeFile(`./data/products.json`, JSON.stringify(this.file, null, 2))
        .then((res) => {
          return { message: "producto actualizado con éxito", code: 201 };
        })
        .catch((error) => ({
          message: `el producto no se ha podido actualizar, ${error}`,
          code: 500,
        }));
      return isStatus200(response.code)
        ? { ...response, data: this.file }
        : response;
    } else
      return {
        message: "el producto a actualizar no se ha encontrado",
        code: 404,
      };
  }

  async deleteById(id) {
    const existProduct = (id) => {
      const productToDelete = this.file.find((item) => item.id === id);
      if (productToDelete) return true;
      else return false;
    };
    if (existProduct(id)) {
      const updatedProducts = this.file.filter((product) => product.id !== id);
      const response = await fs.promises
        .writeFile(`./data/products.json`, JSON.stringify(this.file, null, 2))
        .then((res) => {
          return { message: "producto eliminado con éxito", code: 200 };
        })
        .catch((error) => {
          return {
            message: `el producto no se ha podido eliminar, ${error}`,
            code: 500,
          };
        });
      return isStatus200(response.code)
        ? { ...response, data: updatedProducts }
        : response;
    } else return { message: "producto no encontrado", code: 404 };
  }
}

const products = new Product();

module.exports = products;

// {
//     "nombre": "Escuadra",
//     "descripcion": "regla plàstica",
//     "url": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
//     "precio": 123.45,
//     "stock": 5
// }


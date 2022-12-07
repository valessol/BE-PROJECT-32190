const crypto = require("crypto");
const fs = require("fs");
const data = require("../data/carts.json");
const isStatus200 = require("../helpers");

class Cart {
  constructor() {
    this.file = data;
    this.cart = {};
  }

  generateCartID() {
    if (!this.cart.length) {
      const cartID = crypto.randomUUID();
      return cartID;
    }
  }

  async createCart(cart) {
    if (cart) {
      const updatedCarts = [...this.file, cart];
      const response = await fs.promises
        .writeFile("./data/carts.json", JSON.stringify(updatedCarts, null, 2))
        .then((res) => {
          return { message: "carrito creado con éxito", code: 201 };
        })
        .catch((error) => {
          return {
            message: `el carrito no se ha podido crear, ${error}`,
            code: 500,
          };
        });
      return isStatus200(response.code)
        ? { ...response, data: updatedCarts }
        : response;
    }
  }

  async deleteCartById(id) {
    const existCart = (id) => {
      const cartToDelete = this.file.find((item) => item.id === id);
      if (cartToDelete) return true;
      else return false;
    };
    if (existCart(id)) {
      const updatedCarts = this.file.filter((cart) => cart.id !== id);
      const response = await fs.promises
        .writeFile("./data/carts.json", JSON.stringify(updatedCarts, null, 2))
        .then((res) => {
          return { message: "carrito eliminado con éxito", code: 200 };
        })
        .catch((error) => {
          return {
            message: `el carrito no se ha podido eliminar, ${error}`,
            code: 500,
          };
        });
      return isStatus200(response.code)
        ? { ...response, data: updatedCarts }
        : response;
    } else return { message: "carrito no encontrado", code: 404 };
  }

  getAllProductsInCart(id) {
    const cart = this.file.find((cart) => cart.id === id);
    if (cart) {
      this.cart = cart;
      return {
        message: "productos obtenidos con éxito",
        code: 200,
        data: this.cart,
      };
    } else return { message: "carrito no encontrado", code: 404 };
  }

  getAllCarts() {
    let carts = [];
    if (this.file && this.file.length) {
      carts = this.file;
    }
    return {
      message: "carritos obtenidos con éxito",
      code: 200,
      data: carts,
    };
  }

  async addCart(cart) {
    if (cart) {
      const updatedCartsFile = [...this.file, cart];
      const response = await fs.promises
        .writeFile(
          "./data/carts.json",
          JSON.stringify(updatedCartsFile, null, 2)
        )
        .then((res) => {
          return {
            message: "producto añadido exitosamente",
            code: 201,
            data: updatedCartsFile,
          };
        })
        .catch((error) => {
          return {
            message: `producto no ha podido ser añadido, ${error}`,
            code: 500,
          };
        });
      return response;
    }
  }

  async addProductToCart(id, product) {
    const cart = this.file.find((cart) => cart.id === id);
    if (cart) {
      if (product && product.id) {
        const updatedCart = { ...cart, products: [...cart.products, product] };
        const updatedCartsFile = [
          ...this.file.filter((cart) => cart.id !== id),
          updatedCart,
        ];
        const response = await fs.promises
          .writeFile(
            "./data/carts.json",
            JSON.stringify(updatedCartsFile, null, 2)
          )
          .then((res) => {
            return {
              message: "producto añadido exitosamente",
              code: 201,
              data: updatedCart,
            };
          })
          .catch((error) => {
            return {
              message: `producto no ha podido ser añadido, ${error}`,
              code: 500,
            };
          });
        return response;
      } else return { message: "id de producto no encontrado", code: 404 };
    } else return { message: "carrito no encontrado", code: 404 };
  }

  async deleteProductFromCart(id, id_prod) {
    if (isNaN(id_prod))
      return { message: "id de producto inválido", code: 400 };
    const cart = this.file.find((cart) => cart.id === id);
    const existProductInCart = (id) => {
      const productToDelete = this.file.find((item) => item.id === id);
      if (productToDelete) return true;
      else return false;
    };
    if (cart) {
      const productsInCart = cart.products;
      if (existProductInCart(id_prod)) {
        const updatedProductsList = productsInCart.filter(
          (product) => product.id !== Number(id_prod)
        );
        const updatedCart = { ...cart, products: updatedProductsList };
        const updatedCartsFile = [
          ...this.file.filter((cart) => cart.id !== id),
          updatedCart,
        ];
        const response = await fs.promises
          .writeFile(
            "./data/carts.json",
            JSON.stringify(updatedCartsFile, null, 2)
          )
          .then((res) => {
            return {
              message: "producto eliminado exitosamente del carrito",
              code: 201,
              data: updatedCart,
            };
          })
          .catch((error) => {
            return {
              message: `producto no ha podido ser eliminado, ${error}`,
              code: 500,
            };
          });
        return response;
      } else return { message: "producto no encontrado", code: 404 };
    } else return { message: "carrito no encontrado", code: 404 };
  }
}

const carts = new Cart();

module.exports = carts;


import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";
import fs from "fs";

class CarritosDaoArchivo extends ContenedorArchivo {
  constructor() {
    super("./data/carts.json");
  }

  async addProductToCart(id, product) {
    const cartResponse = await this.findElementById(id);
    const cart = await cartResponse.data;
    if (cart) {
      if (product && product.id) {
        const updatedCart = { ...cart, products: [...cart.products, product] };
        const actualCartsFile = await this.getAllElements();
        const carts = await actualCartsFile.data;
        const updatedCarts = [
          ...carts.filter((cart) => cart.id !== id),
          updatedCart,
        ];
        const response = await fs.promises
          .writeFile("./data/carts.json", JSON.stringify(updatedCarts))
          .then((res) => {
            return {
              message: "product has been successfully added to cart",
              code: 201,
              data: updatedCart,
            };
          })
          .catch((error) => {
            return {
              message: `product has not been added to cart, ${error}`,
              code: 500,
            };
          });
        return response;
      } else return { message: "product id not found", code: 404 };
    } else return { message: "cart not found", code: 404 };
  }

  async getAllProductsInCart(id) {
    const cartResponse = await this.findElementById(id);
    const cart = await cartResponse.data;
    if (cart) {
      return {
        message: "productos obtenidos con éxito",
        code: 200,
        data: cart.products,
      };
    } else return { message: "carrito no encontrado", code: 404 };
  }

  async findProductInCart(id, id_prod) {
    const cartResponse = await this.findElementById(id);
    const cart = await cartResponse.data;
    if (cart && cart.products?.length) {
      const product = cart.products.find((el) => el.id === id_prod);
      if (product)
        return {
          message: "success",
          code: 200,
          data: product,
        };
      else
        return {
          message: "product not found",
          code: 404,
          data: updatedCart,
        };
    } else return { message: "product or cart not found", code: 404 };
  }

  async deleteProductFromCart(id, id_prod) {
    const cartResponse = await this.findElementById(id);
    const cart = await cartResponse.data;
    const productToDeleteResponse = await this.findProductInCart(id, id_prod);
    const productToDelete = await productToDeleteResponse.data;
    if (cart && productToDelete) {
      const productsInCart = cart.products;
      const updatedProductsList = productsInCart.filter(
        (product) => product.id !== id_prod
      );
      const updatedCart = { ...cart, products: updatedProductsList };
      const actualCartsFile = await this.getAllElements();
      const carts = await actualCartsFile.data;
      const updatedCarts = [
        ...carts.filter((cart) => cart.id !== id),
        updatedCart,
      ];
      const response = await fs.promises
        .writeFile("./data/carts.json", JSON.stringify(updatedCarts))
        .then((res) => {
          return {
            message: "product has been successfully deleted",
            code: 201,
            data: updatedCart,
          };
        })
        .catch((error) => {
          return {
            message: `product has not been deleted, ${error}`,
            code: 500,
          };
        });
      return response;
    } else return { message: "product or cart not found", code: 404 };
  }
}

export default CarritosDaoArchivo;

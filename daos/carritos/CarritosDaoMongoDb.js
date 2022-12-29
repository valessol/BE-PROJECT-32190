import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";
import { cartsSchema } from "../../utils/constants.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {
  constructor(database, collectionName) {
    super(database);
    this.collectionName = collectionName;
  }

  async addCollection() {
    await this.initializeDBServer();
    await this.createCollection(this.collectionName, cartsSchema);
  }

  async findCart(id) {
    const cartsCollection = this.findCollection(this.collectionName);
    const cart = cartsCollection.find((el) => el.id === id);
    return cart;
  }

  async addProductToCart(id, product) {
    const cart = this.findCart(id);
    if (cart) {
      if (product && product.id) {
        const updatedProductInCart = [...cart.products, product];
        await this.updateDocuments(
          this.collectionName,
          { id },
          { products: updatedProductInCart }
        );
        const updatedCart = await this.readCollection(this.collectionName);
        return {
          message: "product has been successfully added to cart",
          code: 201,
          data: updatedCart,
        };
      } else return { message: "product id not found", code: 404 };
    } else return { message: "cart not found", code: 404 };
  }

  async findProductInCart(id, id_prod) {
    const cart = this.findCart(id);
    if (cart && cart.products.length) {
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
    const cart = this.findCart(id);
    const productToDelete = await (
      await this.findProductInCart(id, id_prod)
    ).data;
    if (cart && productToDelete) {
      const productsInCart = cart.products;
      const updatedProductsList = productsInCart.filter(
        (product) => product.id !== id_prod
      );
      await this.updateDocuments(
        this.collectionName,
        { id },
        { products: updatedProductsList }
      );

      const updatedCart = { ...cart, products: updatedProductsList };
      const actualCartsFile = await this.readCollection(this.collectionName);
      const carts = await actualCartsFile.data;
      const updatedCarts = [
        ...carts.filter((cart) => cart.id !== id),
        updatedCart,
      ];
      return {
        message: "cart has been successfully updated",
        code: 201,
        data: updatedCart,
      };
    } else return { message: "product or cart not found", code: 404 };
  }
}

export default CarritosDaoMongoDb;

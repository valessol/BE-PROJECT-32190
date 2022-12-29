import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js";

class CarritosDaoFirebase extends ContenedorFirebase {
  constructor(collectionName) {
    super(collectionName);
  }

  async addCollection() {
    await this.initializeDBServer();
    await this.createCollection(this.collectionName);
  }

  // async findCart(id) {
  //   const carts = this.readCollection();
  //   const cartsCollection = this.findCollection(this.collectionName);
  //   const cart = cartsCollection.find((el) => el.id === id);
  //   return cart;
  // }

  async addProductToCart(id, product) {
    const filter = ["id", "==", id];
    const updatedProducts = { products: [...products, product] };
    const updatedCart = await this.updateDocuments(filter, updatedProducts);
    return updatedCart;
  }

  async findProductInCart(id, id_prod) {
    const filter = ["id", "==", id];
    const cart = await this.filterCollection(filter);
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
    const filter = ["id", "==", id];
    const cart = await this.filterCollection(filter);
    const productToDelete = await (
      await this.findProductInCart(id, id_prod)
    ).data;
    if (cart && productToDelete) {
      const productsInCart = cart.products;
      const updatedProductsList = productsInCart.filter(
        (product) => product.id !== id_prod
      );
      await this.updateDocuments(filter, { products: updatedProductsList });
      const updatedCart = await this.readCollection();
      // const updatedCart = { ...cart, products: updatedProductsList };
      // const actualCartsFile = await this.readCollection(this.collectionName);
      // const carts = await actualCartsFile.data;
      // const updatedCarts = [
      //   ...carts.filter((cart) => cart.id !== id),
      //   updatedCart,
      // ];
      return {
        message: "cart has been successfully updated",
        code: 201,
        data: updatedCart,
      };
    } else return { message: "product or cart not found", code: 404 };
  }
}

export default CarritosDaoFirebase;

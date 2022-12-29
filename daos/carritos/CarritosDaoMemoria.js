import ContenedorMemoria from "../../contenedores/ContenedorMemoria.js";

class CarritosDaoMemoria extends ContenedorMemoria {
  constructor() {
    super();
  }

  addProductToCart(id, product) {
    const cart = this.findElementById(id).data;
    if (cart) {
      if (product && product.id) {
        const updatedCart = { ...cart, products: [...cart.products, product] };
        const carts = this.getAllElements().data;
        const updatedCarts = [
          ...carts.filter((cart) => cart.id !== id),
          updatedCart,
        ];
        this.data = updatedCarts;
        return { message: "success", code: 201, data: updatedCart };
      } else return { message: "product id not found", code: 404 };
    } else return { message: "cart not found", code: 404 };
  }

  findProductInCart(id, id_prod) {
    const cart = this.findElementById(id).data;
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
        };
    } else return { message: "product or cart not found", code: 404 };
  }

  getAllProductsInCart(id) {
    const cart = this.findElementById(id).data;
    if (cart) {
      return {
        message: "productos obtenidos con éxito",
        code: 200,
        data: cart.products,
      };
    } else return { message: "carrito no encontrado", code: 404 };
  }

  deleteProductFromCart(id, id_prod) {
    const cart = this.findElementById(id).data;
    const productToDelete = this.findProductInCart(id, id_prod).data;
    if (cart && productToDelete) {
      const productsInCart = cart.products;
      const updatedProductsList = productsInCart.filter(
        (product) => product.id !== id_prod
      );
      const updatedCart = { ...cart, products: updatedProductsList };
      const carts = this.getAllElements().data;
      const updatedCarts = [
        ...carts.filter((cart) => cart.id !== id),
        updatedCart,
      ];
      this.data = updatedCarts;
      return { message: "success", code: 201, data: updatedCart };
    } else return { message: "product or cart not found", code: 404 };
  }
}

export default CarritosDaoMemoria;

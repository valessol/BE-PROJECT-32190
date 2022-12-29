import { Router } from "express";
import carts from "../daos/index.js";
const router = Router();

// create new cart
router.post("/", async (req, res) => {
  const cart = { products: [] };
  const response = await carts.uploadElement(cart);
  res.status(response.code).send(response);
});

// add product to cart
router.post("/:id/productos", async (req, res) => {
  const cartID = req.params.id;
  const product = req.body;
  const response = await carts.addProductToCart(cartID, product);
  res.status(response.code).send(response);
});

// find product by id in cart
router.get("/:id/productos/:id_prod", async (req, res) => {
  const cartId = req.params.id;
  const productId = req.params.id_prod;
  const response = await carts.findProductInCart(cartId, productId);
  res.status(response.code).send(response);
});

// delete a product from cart by id
router.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  const response = await carts.deleteProductFromCart(id, id_prod);
  res.status(response.code).send(response);
});

// get all products in cart
router.get("/:id/productos", async (req, res) => {
  const id = req.params.id;
  const response = await carts.getAllProductsInCart(id);
  res.status(response.code).send(response);
});

// get all carts
router.get("/", async (req, res) => {
  const response = await carts.getAllElements();
  res.status(response.code).send(response);
});

// update cart
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const elementToUpdate = req.body;
  const response = await carts.updateElementById(id, elementToUpdate);
  res.status(response.code).send(response);
});

// delete cart by id
router.delete("/:id", async (req, res) => {
  const cartID = req.params.id;
  const response = await carts.deleteElementById(cartID);
  res.status(response.code).send(response);
});

router.get("*", (req, res) => {
  console.log(req.headers.url);
  res.send({
    error: -2,
    descripcion: `ruta "${req.url}" método "GET" no implementada`,
  });
});

export default router;

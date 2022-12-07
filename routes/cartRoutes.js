const express = require("express");
const carts = require("../classes/Cart");
const isStatus200 = require("../helpers");
const { Router } = express;
const router = Router();

router.post("/", async (req, res) => {
  const newCartID = carts.generateCartID();
  const cart = {
    id: newCartID,
    products: [],
    timestamp: Date.now(),
  };
  const response = await carts.createCart(cart);
  res
    .status(response.code)
    .send(isStatus200(response.code) ? newCartID : response);
});

router.post("/guardar-carrito", async (req, res) => {
  const cart = req.body;
  const response = await carts.addCart(cart);
  res.status(response.code).send(response);
});

router.delete("/:id", async (req, res) => {
  const cartID = req.params.id;
  const response = await carts.deleteCartById(cartID);
  res.status(response.code).send(response);
});

router.get("/:id/productos", async (req, res) => {
  const id = req.params.id;
  const response = await carts.getAllProductsInCart(id);
  res.status(response.code).send(response.data ? response.data : response);
});

router.get("/", async (req, res) => {
  const response = await carts.getAllCarts();
  res.status(response.code).send(response);
});

router.post("/:id/productos", async (req, res) => {
  const cartID = req.params.id;
  const product = req.body;
  const response = await carts.addProductToCart(cartID, product);
  res.status(response.code).send(response);
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  const response = await carts.deleteProductFromCart(id, id_prod);
  res.status(response.code).send(response);
});

router.get("*", (req, res) => {
  console.log(req.headers.url);
  res.send({
    error: -2,
    descripcion: `ruta "${req.url}" método "GET" no implementada`,
  });
});

module.exports = router;


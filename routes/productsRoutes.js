const express = require("express");
const { Router } = express;
const products = require("../classes/Products");
const isAdmin = require("../login/login");

const router = Router();

router.get("/", async (req, res) => {
  const response = await products.getAllProducts();
  res.status(response.code).send(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await products.getProductById(Number(id));
  res.status(response.code).send(response);
});

router.post("/", async (req, res) => {
  if (isAdmin) {
    const product = req.body;
    const response = await products.uploadProduct(product);
    res.status(response.code).send(response);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta "/", método "POST" no autorizada`,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (isAdmin) {
    const updatedProduct = req.body;
    const response = await products.updateProduct(Number(id), updatedProduct);
    res.status(response.code).send(response);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta "/${id}", método "PUT" no autorizada`,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (isAdmin) {
    const response = await products.deleteById(Number(id));
    console.log(response);
    res.status(response.code).send(response);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta "/${id}" método "DELETE" no autorizada`,
    });
  }
});

router.get("*", (req, res) => {
  console.log(req.headers.url);
  res.send({
    error: -2,
    descripcion: `ruta "${req.url}" método "GET" no implementada`,
  });
});

module.exports = router;

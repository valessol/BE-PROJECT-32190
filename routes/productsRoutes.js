import express from "express";
import products from "../daos/index.js";
import isAdmin from "../login/login.js";
const { Router } = express;
const router = Router();
//const { productMemoria, productArchivo, productFirebase, productMongo } = products;

router.get("/", async (req, res) => {
  //const response = async () => {
  //const memoria = await productMemoria.getAllElements();
  //const archivo = await productArchivo.getAllElements();
  //const firebase = await productFirebase.getAllElements();
  //const mongo = await productMongo.getAllElements();
  //return { memoria, archivo, firebase, mongo };
  //};
  const response = await products.getAllElements();
  res.status(200).send(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await products.findElementById(id);
  res.status(response.code).send(response);
});

router.post("/", async (req, res) => {
  if (isAdmin) {
    const product = req.body;
    const response = await products.uploadElement(product);
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
    const response = await products.updateElementById(id, updatedProduct);
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
    const response = await products.deleteElementById(id);
    res.status(response.code).send(response);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta "/${id}" método "DELETE" no autorizada`,
    });
  }
});

router.get("*", (req, res) => {
  res.send({
    error: -2,
    descripcion: `ruta "${req.url}" método "GET" no implementada`,
  });
});

export default router;

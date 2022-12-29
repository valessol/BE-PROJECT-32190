const productsSchema = {
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  price: { type: Number, required: true, maxLength: 100 },
  stock: { type: Number, required: true, maxLength: 100 },
  url: { type: String, required: false, maxLength: 1000 },
  code: { type: Number, required: true, maxLength: 100 },
  timestamp: { type: Number, required: true, maxLength: 100 },
};

const cartsSchema = {
  products: { type: [productsSchema], default: [] },
  timestamp: { type: Number, required: true, maxLength: 100 },
};

const containerOptions = {
  productos: {
    archivo: "./productos/ProductosDaoArchivo.js",
    memoria: "./productos/ProductosDaoMemoria.js",
    mongo: "./productos/ProductosDaoMongoDb.js",
    firebase: "./productos/ProductosDaoFirebase.js",
  },
  carrito: {
    archivo: "./carritos/CarritosDaoArchivo.js",
    memoria: "./carritos/CarritosDaoMemoria.js",
    mongo: "./carritos/CarritosDaoMongoDb.js",
    firebase: "./carritos/CarritosDaoFirebase.js",
  },
};

export { productsSchema, cartsSchema, containerOptions };

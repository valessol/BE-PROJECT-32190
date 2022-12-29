import express from "express";
import cors from "cors";
import { config } from "dotEnv";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
config();
const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 || 201,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);

const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en puerto ${server.address().port}`)
);

server.on("error", (error) => console.log(`Error en servidor ${error}`));

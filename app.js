import express from "express";
import livroRouter from "./Routes/livro.routes.js";
import usuarioRouter from "./Routes/usuario.routes.js";
import { initAdmin, initLivros } from "./utils/init.js";

import "dotenv/config"; // importando o dotenv para carregar as variáveis de ambiente

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use("/public", express.static("public"));

app.use("/livros", livroRouter);
app.use("/usuarios", usuarioRouter);

app.listen(port, () => {
  initAdmin();
  initLivros();

  console.log("Servidor rodando na porta " + port);
});

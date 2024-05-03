import express from "express";
import * as carrinhoController from "../Controllers/carrinho.controllers.js";

const router = express.Router();

router.put("/adicionar", carrinhoController.adcionarAoCarrinho);
router.put("/remover", carrinhoController.removerDoCarrinho);
router.put("/finalizar", carrinhoController.finalizarCompra);

export default router;

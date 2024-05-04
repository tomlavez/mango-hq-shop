
import express from 'express'
import * as usuarioController from '../Controllers/usuario.controllers.js'
import userLevel from "../middlewares/base.middleware.js";
import adminLevel from "../middlewares/admin.middleware.js"

const router = express.Router()

router.get('/', usuarioController.getUsuario) // rota para buscar todos os usuários

router.get('/:usuarioId', usuarioController.getUsuarioPorId) // rota para buscar usuário por id

router.post('/', usuarioController.criarUsuario) // rota para criar um usuário

router.put('/:usuarioId', userLevel, usuarioController.atualizarUsuario) // rota para atualizar um usuário

router.delete('/:usuarioId', adminLevel, usuarioController.deletarUsuario) // rota para deletar um usuário

router.post("/login", usuarioController.login); // rota para login do usuário

export default router


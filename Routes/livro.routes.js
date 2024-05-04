
import express from 'express'
import multer from 'multer'
import path from 'path'
import * as livroController from '../Controllers/livro.controllers.js'
import adminLevel from "../middlewares/admin.middleware.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const router = express.Router()
const upload = multer({storage: storage})

router.get('/', livroController.getLivros) // rota para buscar todos os livros

router.get('/:livroId', livroController.getLivroPorId) // rota para buscar livro por id

router.post('/', adminLevel, upload.single('capa'), livroController.criarLivro) // rota para criar um livro

router.put('/', adminLevel, livroController.criarLivro) // rota para atualizar um livro

router.delete('/:livroId', adminLevel, livroController.deletarLivro) // rota para deletar um livro

export default router
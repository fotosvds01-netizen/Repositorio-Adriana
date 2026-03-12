const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livros.controller');

router.get('/livros/', livrosController.listarLivros);
router.get('/livros/:id', livrosController.buscarLivro);
router.post('/livros/', livrosController.criarLivro);
router.put('/livros/:id', livrosController.atualizarLivro);
router.delete('/livros/:id', livrosController.Controller.deletarLivro);

module.exports = router;
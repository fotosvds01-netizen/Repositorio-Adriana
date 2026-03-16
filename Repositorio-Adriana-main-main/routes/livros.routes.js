const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livros.controller');
const { autenticar, somenteAdmin } = require('../middleware/auth.middleware');

router.get('/livros/', livrosController.listarLivros);
router.get('/livros/:id', livrosController.buscarLivro);
router.post('/livros/', livrosController.criarLivro);
router.put('/livros/:id', livrosController.atualizarLivro);
router.delete('/livros/:id', autenticar, somenteAdmin, livrosController.deletarLivro);

module.exports = router;
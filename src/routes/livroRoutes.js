const express = require('express');
const criarLivroController = require('../controllers/livroController');

module.exports = function livroRoutes(repository) {
  const router = express.Router();
  const controller = criarLivroController(repository);

  router.post('/', controller.criar);
  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.put('/:id', controller.atualizar);
  router.delete('/:id', controller.remover);

  return router;
};

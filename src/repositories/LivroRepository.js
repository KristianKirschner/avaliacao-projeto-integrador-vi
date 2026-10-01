const ILivroRepository = require('../interfaces/ILivroRepository');
const { Livro } = require('../models');

/** Implementação da interface ILivroRepository usando Sequelize. */
class LivroRepository extends ILivroRepository {
  async criar(dados) {
    return Livro.create(dados);
  }

  async listar(status) {
    const where = status ? { status } : {};
    return Livro.findAll({ where, order: [['id', 'ASC']] });
  }

  async buscarPorId(id) {
    return Livro.findByPk(id);
  }

  async atualizar(id, dados) {
    const livro = await Livro.findByPk(id);
    if (!livro) return null;
    return livro.update(dados);
  }

  async remover(id) {
    const livro = await Livro.findByPk(id);
    if (!livro) return false;
    await livro.destroy();
    return true;
  }
}

module.exports = LivroRepository;

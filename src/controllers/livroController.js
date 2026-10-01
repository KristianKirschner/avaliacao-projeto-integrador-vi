const { ValidationError } = require('sequelize');
const ILivroRepository = require('../interfaces/ILivroRepository');

const CAMPOS = ['titulo', 'autor', 'ano', 'status'];

function pegarCampos(body) {
  const dados = {};
  CAMPOS.forEach((campo) => {
    if (body[campo] !== undefined) dados[campo] = body[campo];
  });
  return dados;
}

function tratarErro(res, erro) {
  if (erro instanceof ValidationError) {
    return res.status(400).json({ erro: erro.errors.map((e) => e.message) });
  }
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

/** O controller depende apenas do contrato ILivroRepository (injeção de dependência). */
function criarLivroController(repository) {
  if (!(repository instanceof ILivroRepository)) {
    throw new Error('O repositório deve implementar ILivroRepository');
  }

  async function criar(req, res) {
    try {
      const livro = await repository.criar(pegarCampos(req.body));
      return res.status(201).json(livro);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  async function listar(req, res) {
    try {
      return res.json(await repository.listar(req.query.status));
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  async function buscarPorId(req, res) {
    try {
      const livro = await repository.buscarPorId(req.params.id);
      if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
      return res.json(livro);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  async function atualizar(req, res) {
    try {
      const livro = await repository.atualizar(req.params.id, pegarCampos(req.body));
      if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
      return res.json(livro);
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  async function remover(req, res) {
    try {
      const removido = await repository.remover(req.params.id);
      if (!removido) return res.status(404).json({ erro: 'Livro não encontrado' });
      return res.status(204).send();
    } catch (erro) {
      return tratarErro(res, erro);
    }
  }

  return { criar, listar, buscarPorId, atualizar, remover };
}

module.exports = criarLivroController;

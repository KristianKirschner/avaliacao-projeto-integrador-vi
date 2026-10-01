/**
 * Interface (contrato) do repositório de livros.
 * JavaScript não tem `interface` nativa, então usamos uma classe abstrata:
 * ela não pode ser instanciada e todo método lança erro até ser implementado.
 */
class ILivroRepository {
  constructor() {
    if (new.target === ILivroRepository) {
      throw new Error('ILivroRepository é uma interface e não pode ser instanciada');
    }
  }

  // eslint-disable-next-line no-unused-vars
  async criar(dados) {
    throw new Error('Método criar() não implementado');
  }

  // eslint-disable-next-line no-unused-vars
  async listar(status) {
    throw new Error('Método listar() não implementado');
  }

  // eslint-disable-next-line no-unused-vars
  async buscarPorId(id) {
    throw new Error('Método buscarPorId() não implementado');
  }

  // eslint-disable-next-line no-unused-vars
  async atualizar(id, dados) {
    throw new Error('Método atualizar() não implementado');
  }

  // eslint-disable-next-line no-unused-vars
  async remover(id) {
    throw new Error('Método remover() não implementado');
  }
}

module.exports = ILivroRepository;

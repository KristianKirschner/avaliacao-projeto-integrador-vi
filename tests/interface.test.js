const ILivroRepository = require('../src/interfaces/ILivroRepository');
const LivroRepository = require('../src/repositories/LivroRepository');
const criarLivroController = require('../src/controllers/livroController');

describe('ILivroRepository (interface)', () => {
  it('não pode ser instanciada diretamente', () => {
    expect(() => new ILivroRepository()).toThrow('não pode ser instanciada');
  });

  it('lança erro nos métodos não implementados', async () => {
    class SemImplementacao extends ILivroRepository {}
    const repo = new SemImplementacao();

    await expect(repo.criar({})).rejects.toThrow('criar() não implementado');
    await expect(repo.listar()).rejects.toThrow('listar() não implementado');
    await expect(repo.buscarPorId(1)).rejects.toThrow('buscarPorId() não implementado');
    await expect(repo.atualizar(1, {})).rejects.toThrow('atualizar() não implementado');
    await expect(repo.remover(1)).rejects.toThrow('remover() não implementado');
  });

  it('LivroRepository implementa o contrato', () => {
    expect(new LivroRepository()).toBeInstanceOf(ILivroRepository);
  });

  it('o controller rejeita objetos que não implementam a interface', () => {
    expect(() => criarLivroController({})).toThrow('deve implementar ILivroRepository');
  });
});

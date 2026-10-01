const request = require('supertest');
const app = require('../src/app');
const { sequelize, Livro } = require('../src/models');

const livroValido = {
  titulo: 'Dom Casmurro',
  autor: 'Machado de Assis',
  ano: 1899,
  status: 'lido',
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Livro.destroy({ where: {}, truncate: true });
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/livros', () => {
  it('cria um livro', async () => {
    const res = await request(app).post('/api/livros').send(livroValido);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(livroValido);
    expect(res.body.id).toBeDefined();
  });

  it('usa o status padrão "quero ler"', async () => {
    const res = await request(app).post('/api/livros').send({ titulo: 'A', autor: 'B' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('quero ler');
  });

  it('retorna 400 sem título', async () => {
    const res = await request(app).post('/api/livros').send({ autor: 'X' });
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.erro)).toBe(true);
  });

  it('retorna 400 com título vazio', async () => {
    const res = await request(app).post('/api/livros').send({ titulo: '', autor: 'X' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 sem autor', async () => {
    const res = await request(app).post('/api/livros').send({ titulo: 'X' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 com status inválido', async () => {
    const res = await request(app)
      .post('/api/livros')
      .send({ ...livroValido, status: 'abandonado' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 com ano inválido', async () => {
    const res = await request(app)
      .post('/api/livros')
      .send({ ...livroValido, ano: 3000 });
    expect(res.status).toBe(400);
  });

  it('ignora campos que não existem no modelo', async () => {
    const res = await request(app)
      .post('/api/livros')
      .send({ ...livroValido, hacker: 'x' });
    expect(res.status).toBe(201);
    expect(res.body.hacker).toBeUndefined();
  });

  it('retorna 500 em erro inesperado', async () => {
    jest.spyOn(Livro, 'create').mockRejectedValue(new Error('falha'));
    const res = await request(app).post('/api/livros').send(livroValido);
    expect(res.status).toBe(500);
  });
});

describe('GET /api/livros', () => {
  it('lista vazio', async () => {
    const res = await request(app).get('/api/livros');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('lista todos os livros', async () => {
    await Livro.bulkCreate([
      livroValido,
      { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', status: 'lendo' },
    ]);
    const res = await request(app).get('/api/livros');
    expect(res.body).toHaveLength(2);
  });

  it('filtra por status', async () => {
    await Livro.bulkCreate([
      livroValido,
      { titulo: 'O Cortiço', autor: 'Aluísio Azevedo', status: 'lendo' },
    ]);
    const res = await request(app).get('/api/livros?status=lendo');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe('O Cortiço');
  });

  it('retorna 500 em erro inesperado', async () => {
    jest.spyOn(Livro, 'findAll').mockRejectedValue(new Error('falha'));
    const res = await request(app).get('/api/livros');
    expect(res.status).toBe(500);
  });
});

describe('GET /api/livros/:id', () => {
  it('busca um livro existente', async () => {
    const livro = await Livro.create(livroValido);
    const res = await request(app).get(`/api/livros/${livro.id}`);
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Dom Casmurro');
  });

  it('retorna 404 se não existir', async () => {
    const res = await request(app).get('/api/livros/999');
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro inesperado', async () => {
    jest.spyOn(Livro, 'findByPk').mockRejectedValue(new Error('falha'));
    const res = await request(app).get('/api/livros/1');
    expect(res.status).toBe(500);
  });
});

describe('PUT /api/livros/:id', () => {
  it('atualiza um livro', async () => {
    const livro = await Livro.create(livroValido);
    const res = await request(app)
      .put(`/api/livros/${livro.id}`)
      .send({ status: 'quero ler' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('quero ler');
    expect(res.body.titulo).toBe('Dom Casmurro');
  });

  it('retorna 404 se não existir', async () => {
    const res = await request(app).put('/api/livros/999').send({ titulo: 'X' });
    expect(res.status).toBe(404);
  });

  it('retorna 400 com dados inválidos', async () => {
    const livro = await Livro.create(livroValido);
    const res = await request(app).put(`/api/livros/${livro.id}`).send({ titulo: '' });
    expect(res.status).toBe(400);
  });

  it('retorna 500 em erro inesperado', async () => {
    jest.spyOn(Livro, 'findByPk').mockRejectedValue(new Error('falha'));
    const res = await request(app).put('/api/livros/1').send({ titulo: 'X' });
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/livros/:id', () => {
  it('remove um livro', async () => {
    const livro = await Livro.create(livroValido);
    const res = await request(app).delete(`/api/livros/${livro.id}`);
    expect(res.status).toBe(204);
    expect(await Livro.findByPk(livro.id)).toBeNull();
  });

  it('retorna 404 se não existir', async () => {
    const res = await request(app).delete('/api/livros/999');
    expect(res.status).toBe(404);
  });

  it('retorna 500 em erro inesperado', async () => {
    jest.spyOn(Livro, 'findByPk').mockRejectedValue(new Error('falha'));
    const res = await request(app).delete('/api/livros/1');
    expect(res.status).toBe(500);
  });
});

describe('Interface', () => {
  it('serve a página inicial', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Minha Biblioteca');
  });
});

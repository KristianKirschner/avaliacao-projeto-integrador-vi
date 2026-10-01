describe('config/database', () => {
  const envOriginal = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = envOriginal;
    jest.resetModules();
  });

  it('usa banco em memória nos testes', () => {
    process.env.NODE_ENV = 'test';
    const sequelize = require('../src/config/database');
    expect(sequelize.options.storage).toBe(':memory:');
  });

  it('usa arquivo SQLite fora dos testes', () => {
    process.env.NODE_ENV = 'production';
    const sequelize = require('../src/config/database');
    expect(sequelize.options.storage).toBe('database.sqlite');
  });
});

const { Sequelize } = require('sequelize');

// Em testes usa banco em memória; no uso normal grava em um arquivo SQLite.
const storage = process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});

module.exports = sequelize;

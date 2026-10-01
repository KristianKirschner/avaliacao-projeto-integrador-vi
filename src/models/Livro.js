const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUS = ['lido', 'lendo', 'quero ler'];

const Livro = sequelize.define('Livro', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O título é obrigatório' },
    },
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O autor é obrigatório' },
    },
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: { msg: 'O ano deve ser um número inteiro' },
      min: { args: [0], msg: 'O ano deve ser maior ou igual a 0' },
      max: { args: [2100], msg: 'O ano deve ser menor ou igual a 2100' },
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'quero ler',
    validate: {
      isIn: { args: [STATUS], msg: `O status deve ser: ${STATUS.join(', ')}` },
    },
  },
}, {
  tableName: 'livros',
});

Livro.STATUS = STATUS;

module.exports = Livro;

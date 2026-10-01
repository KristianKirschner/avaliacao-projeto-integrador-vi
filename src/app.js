const path = require('path');
const express = require('express');
const livroRoutes = require('./routes/livroRoutes');
const LivroRepository = require('./repositories/LivroRepository');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); // Interface web
app.use('/api/livros', livroRoutes(new LivroRepository()));

module.exports = app;

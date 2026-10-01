# Minha Biblioteca

CRUD de livros com interface web.

## Como rodar
```bash
npm install
npm start        # http://localhost:3000
npm test         
```

## Estrutura
```
src/config/database.js          conexão Sequelize (SQLite)
src/models/Livro.js             modelo + validações
src/interfaces/ILivroRepository.js   INTERFACE (contrato) do repositório
src/repositories/LivroRepository.js  implementação com Sequelize
src/controllers/livroController.js
src/routes/livroRoutes.js       rotas /api/livros
src/app.js                      app Express (também serve a interface)
src/server.js                   sobe o servidor
public/                         interface (HTML, CSS, JS)
tests/livro.test.js             testes Jest + Supertest
```

## API
| Método | Rota | Descrição |
|---|---|---|
| POST | /api/livros | cria livro |
| GET | /api/livros?status=lido | lista (filtro opcional) |
| GET | /api/livros/:id | busca por id |
| PUT | /api/livros/:id | atualiza |
| DELETE | /api/livros/:id | remove |

require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');

const path = require('path');

// Módulo que faz conexão com o banco de dados
const pool = require('../db/conn');

// Executar express
const app = express();

const PORT = process.env.PORT;

// Conseguir pegar o body
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Transformar os dados do body em json
app.use(express.json());

// Alterar o template engine para handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar páginas estáticas para css
app.use(express.static(__dirname + '../../' + '/public'));

// Pegar os dados do formulário e enviar para o banco de dados
app.post('/books/insertbook', (req, res) => {
  // Pegar a req do input title
  const title = req.body.title;
  // Pegar a req do input pagesnumb
  const pagesnumb = req.body.pagesnumb;

  // String que vai ser executada no banco inserindo dados
  let sql = `INSERT INTO books (??, ??) VALUES (?, ?)`;
  const data = ['name', 'page_numb', title, pagesnumb];

  // tratamento de erros e redirecionamento
  if (title === '' || pagesnumb === undefined) {
    res.redirect('/');
  }

  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    res.redirect('/books');
  });
});

// Pegar os dados do formulário e atualizar no banco de dados
app.post('/books/updatebook', (req, res) => {
  // Pegar a req do input title
  const title = req.body.title;
  // Pegar a req do input pagesnumb
  const pagesnumb = req.body.pagesnumb;
  // Pegar a req do input id
  const id = req.body.id;

  // String que vai ser executada no banco inserindo dados
  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
  const data = ['name', title, 'page_numb', pagesnumb, 'id', id];

  // tratamento de erros e redirecionamento
  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    res.redirect('/books');
  });
});

// Pegar os dados do formulário e excluir do banco de dados
app.post('/books/delete/:id', (req, res) => {
  const id = req.params.id;

  // String que vai ser executada no banco inserindo dados
  const sql = `DELETE FROM books WHERE ?? = ?`;
  const data = ['id', id];

  // tratamento de erros e redirecionamento
  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    res.redirect('/books');
  });
});

// Rota Books (lista de livros)
// Pegar os dados do banco e exibir
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM books';

  pool.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const books = data;

    res.render('books', { books });
  });
});

// Rota Book (livro individual)
app.get('/books/:id', (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const book = data[0];

    res.render('book', { book });
  });
});

// Abrir o formulário de edição
app.get('/books/edit/:id', (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const book = data[0];

    res.render('editBook', { book });
  });
});

// Rota Home
app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

// função que permite usar os dados do arquivo .env
require('dotenv').config();

// Importação do módulo express
const express = require("express");

// Intancia do módulo express
const app = express();

// Configuração para o express manipular JSON
app.use(express.json());

// PORT usada para rodar o projeto
const PORT = process.env.PORT || 3000;

// TESTE DE CONEXÃO
const connection = require("./src/config/database/database")
console.log(connection);

// Importando as rotas
const Produto = require('./src/controller/ProdutoController');
app.use('/produto', Produto)

const Categoria = require('./src/controller/CategoriaController');
app.use('/categoria', Categoria)

app.listen(PORT, ()=>{
    console.log('\x1b[42;30m%s\x1b[0m', ` API RODANDO EM - http://localhost:${PORT} `);
});

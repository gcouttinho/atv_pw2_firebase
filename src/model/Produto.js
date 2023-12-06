// IMPORTAÇÃO DO MÓDULO SEQUELIZE
const sequelize = require("sequelize");

// IMPORTAÇÃO DA CONEXÃO COM O BANCO DE DADOS
const connection = require("../config/database/database")

/*Importação da tabela de categoria para criação da chave estrangeira
representanto a cardinalidade*/
const Categoria = require('./Categoria');

const Produto = connection.define(
    'tbl_produtos',
    {
        codigo_produto: {
            type: sequelize.INTEGER(10).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        codigo_categoria: {
            type: sequelize.INTEGER(10).UNSIGNED,
            allowNull: false
        },

        nome_produto: {
            type: sequelize.STRING(255),
            allowNull: false
        },

        valor_produto: {
            type: sequelize.DECIMAL(10, 2),
            allowNull: false
        },

        imagem_peq:{
            type: sequelize.STRING,
            allowNull: false
        },
        imagem_peq_url:{
            type: sequelize.STRING,
            allowNull: false
        },
        imagem_grd:{
            type: sequelize.STRING,
            allowNull: false
        },
        imagem_grd_url:{
            type: sequelize.STRING,
            allowNull: false
        },

        descricao_produto: {
            type: sequelize.TEXT,
            allowNull: false
        }
    }
);

/*Implementação da CHAVE ESTRANGEIRA - LADO N*/
Categoria.hasMany(Produto, {
    foreignKey: 'codigo_categoria',
    sourceKey: 'codigo_categoria'
});


/*Implementação da CHAVE PRIMÁRIA - LADO 1*/
Produto.belongsTo(Categoria, {
    foreignKey: 'codigo_categoria',
    sourceKey: 'codigo_categoria'
});

/*
SINCRONIZAÇÃO COM O BANCO DE DADOS - CRIA A TABELA CASO ESSA NÃO EXISTA
*/
Produto.sync({ force: false })

module.exports = Produto;
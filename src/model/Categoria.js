// IMPORTAÇÃO DO MÓDULO SEQUELIZE
const sequelize = require("sequelize");

// IMPORTAÇÃO DA CONEXÃO COM O BANCO DE DADOS
const connection = require("../config/database/database")


const Categoria = connection.define(
    'tbl_categoria', 
    {
        codigo_categoria:{
            type: sequelize.INTEGER(10).UNSIGNED, 
            autoIncrement: true,
            primaryKey: true
        },

        nome_categoria:{
            type: sequelize.STRING(255),
            allowNull: false
        },

        observacoes_categoria:{
            type: sequelize.TEXT,
            allowNull: false
        }
    }
);

/*
SINCRONIZAÇÃO COM O BANCO DE DADOS - CRIA A TABELA CASO ESSA NÃO EXISTA
*/
Categoria.sync({force:false})

module.exports = Categoria
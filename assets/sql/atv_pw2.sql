CREATE DATABASE IF NOT EXISTS atv_final_pw2;
USE atv_final_pw2;

-- CRIAÇÃO DA TABELA PRODUTO
CREATE TABLE tbl_produto(
	codigo_produto INT unsigned auto_increment PRIMARY KEY,
	codigo_categoria INT unsigned NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    valor_produto DECIMAL(10,2) NOT NULL,
    imagem_produto VARCHAR(500) NOT NULL,
    descricao_produto TEXT NOT NULL
);

-- CRIAÇÃO DA TABELA CATEGORIA
CREATE TABLE tbl_categoria(
	codigo_categoria INT unsigned auto_increment PRIMARY KEY,
    nome_categoria VARCHAR(255) NOT NULL,
    observacoes_categoria TEXT NOT NULL
);

-- RELACIONAMENTOS DA TABELA PRODUTO

ALTER TABLE tbl_produto ADD CONSTRAINT fk_tbl_produto_tbl_categoria
FOREIGN KEY (codigo_categoria)
REFERENCES tbl_categoria (codigo_categoria);

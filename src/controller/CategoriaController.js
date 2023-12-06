
const express = require("express");

const categoriaModel = require("../model/Categoria");

const router = express.Router();

// ROTA DE INSERÇÃO DE CATEGORIA
router.post("/cadastrarCategoria", (req, res) => {

    let { nome_categoria, observacoes_categoria } = req.body;
    //console.log(nome_categoria);

    categoriaModel.create({ nome_categoria, observacoes_categoria })
        .then(
            () => {
                return res.status(201).json({
                    errorStatus: false,
                    messageStatus: `Categoria ${nome_categoria} cadastrada com sucesso!`
                });
            })

        .catch(
            (error) => {
                return res.status(500).json({
                    errorStatus: true,
                    messageStatus: error
                });
            });

});

// ROTA DE LISTAGEM DE CATEGORIA
router.get("/listarCategoria", (req, res) => {
    categoriaModel.findAll()
        .then(
            (categorias) => {
                return res.status(200).json(categorias)
            }
        )
        .catch(
            (error) => {
                return res.status(500).json({
                    errorStatus: true,
                    messageStatus: error
                });
            });
});

// ROTA DE BUSCA DE CATEGORIA POR ID
router.get('/listarCategoria/:codigo_categoria', (req, res)=>{
    let {codigo_categoria} = req.params;

    categoriaModel.findByPk(codigo_categoria)
    .then(
        (categoria)=>{
            return res.status(200).json(categoria);
        }
    )
    .catch(
        (error) => {
            return res.status(500).json({
                errorStatus: true,
                messageStatus: error
            });
        });
});

// ROTA DE ALTERAR CATEGORIA
router.put('/alterarCategoria', (req, res)=>{
    let {codigo_categoria, nome_categoria, observacoes_categoria} = req.body;

    categoriaModel.update(
        {nome_categoria, observacoes_categoria},
        {where:{codigo_categoria}}
    )
    .then(
        ()=>{
            return res.status(200).json(
                {
                    errorStatus: false,
                    messageStatus: `Categoria ${codigo_categoria}: ${nome_categoria} alterada com sucesso!`
                }
            )
        }
    )
    .catch(
        (error) => {
            return res.status(500).json({
                errorStatus: true,
                messageStatus: error
            });
        });
});

// ROTA DE EXCLUSÃO DE CATEGORIA
router.delete('/excluirCategoria/:codigo_categoria', (req, res)=>{
    let {codigo_categoria} = req.params;

    categoriaModel.destroy(
        {where:{codigo_categoria}}
    )
    .then(
        ()=>{
            return res.status(200).json(
                {
                    errorStatus: false,
                    messageStatus: `Categoria ${codigo_categoria} excluída com sucesso!`
                }
            )
        }
    )
    .catch(
        (error) => {
            return res.status(500).json({
                errorStatus: true,
                messageStatus: error
            });
        });
});


module.exports = router;
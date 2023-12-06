const storage = require('../config/firebase/firebaseStorageConfig').storage;
const storageAll = require('../config/firebase/firebaseStorageConfig');

const router = require('../config/router/routerConfig');

const produto = require('../model/Produto')

const uploadImage = require('../helpers/uploadImagem');
const deleteImage = require('../helpers/deleteImagem');

const sequelize = require('../config/database/database');

// ROTA DE INSERÇÃO DE PRODUTO
router.post('/cadastrarProduto', uploadImage.array('files', 2), (req, res) => {

    const { nome_produto, valor_produto, descricao_produto, codigo_categoria } = req.body;
    let imagem_peq_url, imagem_peq, imagem_grd_url, imagem_grd;
    let count = 0;
    const files = req.files;

    files.forEach(file => {

        const fileName = Date.now().toString() + '-' + file.originalname;
        const fileRef = storageAll.ref(storage, fileName);

        storageAll.uploadBytes(fileRef, file.buffer)
            .then((snapshot) => {
                imageRef = storageAll.ref(storage, snapshot.metadata.name);

                storageAll.getDownloadURL(imageRef)
                    .then((urlFinal) => {
                        if (count == 0) {
                            imagem_peq = fileName;
                            imagem_peq_url = urlFinal;
                            count++;
                            console.log('\x1b[38;5;33m%s\x1b[0m', `\n Nome da imagem pequena: ${imagem_peq} `);
                            console.log('\x1b[38;5;33m%s\x1b[0m', `\n Url da imagem pequena: ${urlFinal} `);
                        } else {
                            imagem_grd = fileName;
                            imagem_grd_url = urlFinal;
                            count++;
                            console.log('\x1b[38;5;33m%s\x1b[0m', `\n Nome da imagem grande: ${imagem_grd} `);
                            console.log('\x1b[38;5;33m%s\x1b[0m', `\n Url da imagem grande: ${urlFinal} `);
                        };

                        if (imagem_peq && imagem_grd) {
                            produto.create({
                                nome_produto, valor_produto, imagem_grd, imagem_grd_url, imagem_peq, imagem_peq_url, descricao_produto, codigo_categoria
                            }).then(() => {
                                return res.status(201).json({
                                    errorStatus: false,
                                    mensagemStatus: `Produto ${nome_produto} cadastrado com sucesso!`
                                });
                            }).catch((error) => {
                                return res.status(400).json({
                                    errorStatus: true,
                                    errorMensagem: `Ops!! Ocorreu um erro: ${error}`
                                });
                            });

                        };
                    });
            }).catch((error) => {
                res.send(`ERRO: ${error}`)
            });
    });
});

// ROTA DE LISTAGEM DE PRODUTO
router.get('/listarProduto', (req, res) => {

    produto.findAll()
        .then((produtos) => {
            return res.status(200).json(produtos)
        }).catch((erro) => {
            return res.status(400).json({
                errorStatus: true,
                errorMensagem: `Ops!! Ocorreu um erro: ${error}`
            })
        });
});

// ROTA DE BUSCA DE PRODUTO POR ID
router.get('/listarProduto/:codigo_produto', (req, res) => {

    const { codigo_produto } = req.params

    produto.findByPk(codigo_produto)
        .then((produto) => {
            return res.status(200).json(produto)
        }).catch((error) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: `Ops!! Ocorreu um erro: ${error}`
            });
        });
});

// ROTA DE EXCLUSÃO DE PRODUTO
router.delete('/excluirProduto/:codigo_produto', (req, res) => {
    const { codigo_produto } = req.params;

    produto.findByPk(codigo_produto)
        .then((produtoToDelete) => {
            if (!produtoToDelete) {
                return res.status(404).json({
                    erroStatus: true,
                    erroMensagem: 'Produto não encontrado.'
                });
            }

            return Promise.resolve()
                .then(() => deleteImage(produtoToDelete.imagem_peq))
                .then(() => deleteImage(produtoToDelete.imagem_grd))
                .then(() => produtoToDelete.destroy())
                .then(() => {
                    return res.status(200).json({
                        erroStatus: false,
                        mensagemStatus: `Produto ${codigo_produto} excluído com sucesso.`
                    });
                })
                .catch((error) => {
                    return res.status(400).json({
                        erroStatus: true,
                        erroMensagem: `Ops!! Ocorreu um erro: ${error.message}`
                    });
                });
        })
        .catch((error) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: `Ops!! Ocorreu um erro: ${error.message}`
            });
        });
});

// ROTA DE ALTERAR PRODUTO COM IMAGEM
router.put('/editarProduto/:codigo_produto', uploadImage.array('files', 2), (req, res) => {
    const { codigo_produto } = req.params;
    const { nome_produto, valor_produto, descricao_produto, codigo_categoria } = req.body;
    let imagem_peq_url, imagem_peq, imagem_grd_url, imagem_grd;

    sequelize.transaction().then((t) => {
        return produto.findByPk(codigo_produto, { transaction: t }).then((produtoAntigo) => {
            if (produtoAntigo) {
                const imagemAntigaPeqRef = storageAll.ref(storage, produtoAntigo.imagem_peq);
                const imagemAntigaGrdRef = storageAll.ref(storage, produtoAntigo.imagem_grd);

                return Promise.all([
                    storageAll.deleteObject(imagemAntigaPeqRef),
                    storageAll.deleteObject(imagemAntigaGrdRef),
                ]).then(() => produtoAntigo);
            } else {
                throw new Error('Produto não encontrado');
            }
        }).then((produtoAntigo) => {
            const files = req.files;
            const promises = [];

            for (const file of files) {
                const fileName = Date.now().toString() + '-' + file.originalname;
                const fileRef = storageAll.ref(storage, fileName);

                promises.push(
                    storageAll.uploadBytes(fileRef, file.buffer, { transaction: t }).then(() => {
                        const imageRef = storageAll.ref(storage, fileName);
                        return storageAll.getDownloadURL(imageRef).then((urlFinal) => {
                            if (!imagem_peq) {
                                imagem_peq = fileName;
                                imagem_peq_url = urlFinal;
                            } else {
                                imagem_grd = fileName;
                                imagem_grd_url = urlFinal;
                            }
                        });
                    })
                );
            }

            return Promise.all(promises).then(() => produtoAntigo);
        }).then((produtoAntigo) => {
            return produto.update(
                {
                    nome_produto,
                    valor_produto,
                    descricao_produto,
                    imagem_peq,
                    imagem_peq_url,
                    imagem_grd,
                    imagem_grd_url,
                    codigo_categoria
                },
                { where: { codigo_produto }, transaction: t }
            );
        }).then(() => {
            t.commit();
            return res.status(200).json({
                erroStatus: false,
                mensagemStatus: `Produto ${codigo_produto}: ${nome_produto} alterado com sucesso.`
            });
        }).catch((error) => {
            t.rollback();
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: `Ops!! Ocorreu um erro: ${error.message}`
            });
        });
    }).catch((error) => {
        return res.status(400).json({
            erroStatus: true,
            erroMensagem: `Ops!! Ocorreu um erro: ${error.message}`
        });
    });
});

// ROTA DE ALTERAR PRODUTO SEM IMAGEM
router.put('/editarProduto', (req, res) => {

    const { nome_produto, valor_produto, descricao_produto, codigo_categoria, imagem_peq, imagem_grd, codigo_produto } = req.body;

    produto.update(
        {
            nome_produto,
            valor_produto,
            descricao_produto,
            imagem_peq,
            imagem_grd,
            codigo_categoria
        },
        { where: { codigo_produto } }
    ).then(
        () => {
            return res.status(200).json({
                erroStatus: false,
                mensagemStatus: `Produto ${codigo_produto}: ${nome_produto} alterado com sucesso.`
            });
        }).catch((error) => {
            return res.status(400).json({
                erroStatus: true,
                erroMensagem: `Ops!! Ocorreu um erro: ${error}`
            });
        });
});

module.exports = router;

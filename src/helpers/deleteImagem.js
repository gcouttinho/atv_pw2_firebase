const storage = require('../config/firebase/firebaseStorageConfig').storage;
const { ref, deleteObject } = require("firebase/storage");

const deleteImage = (imagem)=>{

    const deleteRef = ref(storage, imagem);

    deleteObject(deleteRef)
    .then(()=>{
        console.log(`Imagem ${imagem} excluída com sucesso!`);
    })
    .catch((error)=>{
        console.error(`Erro ao excluir a imagem ${imagem}: ${error}`);
    });

}

module.exports = deleteImage;
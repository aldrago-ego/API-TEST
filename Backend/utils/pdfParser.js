// const fs = require('fs');
// const pdfParse = require('pdf-parse').default;

// /**
//  * Analyse un fichier PDF et extrait le texte
//  * @param {string} filePath
//  * @returns {Object}
//  */
// async function parsePdfFile(filePath) {
//     try {
//         const dataBuffer = fs.readFileSync(filePath);
//         const data = await pdfParse(dataBuffer);

//         return {
//             text: data.text,
//             pages: data.numpages,
//             info: data.info
//         };
//     } catch (error) {
//         console.error('Erreur lors de l’analyse du PDF:', error);
//         throw new Error('Impossible d’analyser le fichier PDF');
//     }
// }

// module.exports = { parsePdfFile };

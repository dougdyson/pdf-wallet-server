const pdfParse = require('pdf-parse');

const pdfText = async (file) => await pdfParse(file);

module.exports = { pdfText };
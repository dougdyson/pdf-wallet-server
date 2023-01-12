const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const keccak256 = require('keccak256');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(fileUpload());
app.use(cors());

// need to include protection against CSRF

app.post('/extract', (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  pdfParse(req.files.pdfFile).then((result) => {
    const hash = keccak256(result.text).toString('hex');
    res.send({hash});
  });
});

app.listen(PORT, () => {
  console.log(`PDF server listening on port ${PORT}`);
});
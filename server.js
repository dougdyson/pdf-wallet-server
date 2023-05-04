const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const keccak256 = require('keccak256');
const env = require('dotenv').config();
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(fileUpload());
app.use(cors());

// need to include protection against CSRF!

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(embeddings);

app.post('/extract', async (req, res) => {
  try {
    if (!req.files && !req.files.pdfFile) {
      res.status(400);
      res.end();
      return;
    }

    const result = await pdfParse(req.files.pdfFile);
    const hash = keccak256(result.text).toString('hex');

    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });

    const docEmbeddings = await embeddings(result.text);

    res.send({ docEmbeddings, hash });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
});


app.listen(PORT, () => {
  console.log(`PDF server listening on port ${PORT}`);
});
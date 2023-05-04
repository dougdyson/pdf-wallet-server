const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const keccak256 = require('keccak256');
const env = require('dotenv').config().parsed;
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(fileUpload());
app.use(cors());

// need to include protection against CSRF!

const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});
const docEmbeds = async (text) => await embeddings.embedQuery(text);
const pdfText = async (file) => await pdfParse(file);

app.post('/extract', (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    res.status(400).end();
    return;
  }

  pdfText(req.files.pdfFile).then((result) => {
    
    const hash = keccak256(result.text).toString('hex');

    docEmbeds(result.text).then((embeds) => {
      console.log(embeds);
      // write to file as a json object
      fs.writeFile(`./kccsr.json`, JSON.stringify(embeds), (err) => {
        if (err) {
          console.error(err);
        }
      }
    );

    }).catch((error) => {
      console.error(error);
    });

    res.send({ hash });
  }).catch((error) => {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PDF server listening on port ${PORT}`);
});

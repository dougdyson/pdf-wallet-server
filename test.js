import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import dotenv from "dotenv";

const env = dotenv.config();
console.log(env);

/* Create instance */
const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY});

/* Embed queries */
const res = await embeddings.embedQuery("Hello world");

console.log(res);
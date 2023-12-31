import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

const CHUNK_OVERLAP = 200;
const CHUNK_SIZE = 1000;

export const splitTextInDocuments = async (text: string) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: CHUNK_OVERLAP,
    chunkSize: CHUNK_SIZE,
  });
  const documents = await textSplitter.splitDocuments([
    new Document({
      metadata: { source: process.argv[2], type: "file" },
      pageContent: text,
    }),
  ]);
  return documents;
};

import path from "path";

import { readPdf, splitTextInDocuments, Pinecone } from "./utils";

const testFilePath = path.join(__dirname, "..", "test-files", process.argv[2]);

const uploadFileToPinecone = async () => {
  const content = await readPdf(testFilePath);
  const documents = await splitTextInDocuments(content ?? "");
  const pinecone = new Pinecone();
  await pinecone.init();
  pinecone.storeDocuments(documents);
};

(async () => {
  await uploadFileToPinecone();
})();

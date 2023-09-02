import path from "path";

import { readPdf, splitTextInDocuments, Pinecone } from "./utils";

const filename = "1-OS-Overview.pdf";

const testFilePath = path.join(__dirname, "..", "test-files", filename);

const uploadFileToPinecone = async () => {
  const content = await readPdf(testFilePath);
  const documents = await splitTextInDocuments(content ?? "", filename);
  const pinecone = new Pinecone();
  await pinecone.init();
  pinecone.storeDocuments(documents);
};

(async () => {
  await uploadFileToPinecone();
})();

import path from "path";

import { readPdf, splitContentInDocuments, Pinecone } from "./utils";

const filename = "1-OS-Overview.pdf";

const testFilePath = path.join(__dirname, "..", "test-files", filename);

const uploadFileToPinecone = async () => {
  const content = await readPdf(testFilePath);
  const documents = await splitContentInDocuments(content ?? "", filename);
  const pinecone = new Pinecone();
  await pinecone.init();
  pinecone.storeDocuments(documents);
};

uploadFileToPinecone();

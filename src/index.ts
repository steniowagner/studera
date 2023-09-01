import path from "path";

import { readPdf, splitContentInDocuments } from "./utils";

const testFilePath = path.join(
  __dirname,
  "..",
  "test-files",
  "1-OS-Overview.pdf"
);

const run = async () => {
  const content = await readPdf(testFilePath);
  const documents = await splitContentInDocuments(
    content ?? "",
    "1-OS-Overview"
  );
  console.log(documents);
  // console.log(content);
};

run();

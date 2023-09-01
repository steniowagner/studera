import path from "path";

import { readPdf } from "./utils/read-pdf";

const testFilePath = path.join(
  __dirname,
  "..",
  "test-files",
  "1-OS-Overview.pdf"
);

const run = async () => {
  const content = await readPdf(testFilePath);
  console.log(content);
};

run();

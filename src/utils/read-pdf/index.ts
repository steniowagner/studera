import fs from "fs";
import util from "util";
import pdfParse from "pdf-parse";

const readFile = util.promisify(fs.readFile);

export const readPdf = async (path: string) => {
  try {
    const file = await readFile(path);
    const content = await pdfParse(file);
    return content;
  } catch (err) {
    console.error(err);
  }
};

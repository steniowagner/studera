import fs from "fs";
import path from "path";
import util from "util";

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

export const writeTXTFile = async (filename: string, content: string) => {
  const basePath = path.join(__dirname.split("src")[0], "src", "outputs");
  const filePath = path.join(basePath, `${filename}.txt`);
  if (!fs.existsSync(basePath)) {
    await mkdir(basePath);
  }
  await writeFile(filePath, content);
};

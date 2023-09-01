declare module "pdf-parse" {
  function pdfParse(input: Uint8Array): Promise<string>;
  export default pdfParse;
}

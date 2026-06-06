import { PDFParse } from "pdf-parse";

export async function extractPdfText(
  buffer: Buffer
) {
  const parser = new PDFParse({
    data: buffer,
  });

  const result =
    await parser.getText();

  return result.text;
}
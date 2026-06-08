import { PDFParse } from "pdf-parse";

export async function extractPdfText(
  buffer: Buffer
) {
  if (!buffer.length) {
    throw new Error(
      "Empty file received"
    );
  }

  const parser =
    new PDFParse({
      data: buffer,
    });

  const result =
    await parser.getText();

  const text =
    result.text.trim();

  if (!text) {
    throw new Error(
      "No text found in resume"
    );
  }

  return text;
}
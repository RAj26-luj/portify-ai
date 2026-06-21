import pdfParse from "pdf-parse/lib/pdf-parse";

export async function extractResumeText(
  file: Buffer
): Promise<string> {
  const result = await pdfParse(file);

  const text = result.text?.trim();

  if (!text) {
    throw new Error(
      "Unable to extract text from resume"
    );
  }

  return text;
}
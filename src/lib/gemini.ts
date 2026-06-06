import OpenAI from "openai";

export function getAI() {
  const apiKey =
    process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is missing"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL:
      "https://openrouter.ai/api/v1",
  });
}
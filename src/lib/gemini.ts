import OpenAI from "openai";
import { aiConfig } from "@/config/ai";

let client: OpenAI | null = null;

export function getAI() {
  if (!client) {
    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY is missing"
      );
    }

    client = new OpenAI({
      apiKey,
      baseURL:
        "https://openrouter.ai/api/v1",
    });
  }

  return client;
}

export async function generateText(
  prompt: string,
  model = aiConfig.defaultModel
) {
  const ai = getAI();

  const response =
    await ai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return (
    response.choices[0]
      ?.message?.content ?? ""
  );
}

export async function generateJson<T>(
  prompt: string,
  model = aiConfig.defaultModel
): Promise<T> {
  const result =
    await generateText(
      `${prompt}

Return only valid JSON.`,
      model
    );



  const match =
    result.match(
      /\{[\s\S]*\}/
    );

  if (!match) {
    throw new Error(
      "No valid JSON found in AI response"
    );
  }

  return JSON.parse(
    match[0]
  ) as T;
}
import { ai } from "@/lib/gemini";
import { aiConfig } from "@/config/ai";

export async function improveBio(
  bio: string
) {
  const response =
    await ai.chat.completions.create({
      model:
        aiConfig.defaultModel,

      messages: [
        {
          role: "system",
          content:
            "Improve the portfolio bio professionally.",
        },
        {
          role: "user",
          content: bio,
        },
      ],
    });

  return (
    response.choices[0]
      ?.message?.content ?? bio
  );
}

export async function generateProjectDescription(
  title: string,
  techStack: string[]
) {
  const response =
    await ai.chat.completions.create({
      model:
        aiConfig.defaultModel,

      messages: [
        {
          role: "system",
          content:
            "Generate a professional project description.",
        },
        {
          role: "user",
          content: `
Project: ${title}

Tech Stack:
${techStack.join(", ")}
`,
        },
      ],
    });

  return (
    response.choices[0]
      ?.message?.content ?? ""
  );
}

export async function parseResumeText(
  text: string
) {
  const response =
    await ai.chat.completions.create({
      model:
        aiConfig.defaultModel,

      messages: [
        {
          role: "system",
          content:
            "Extract portfolio information and return JSON only.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

  return (
    response.choices[0]
      ?.message?.content ?? "{}"
  );
}
import { getAI } from "@/lib/gemini";
import { aiConfig } from "@/config/ai";

export async function improveBio(
  bio: string
) {
  const ai = getAI();

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
  const ai = getAI();

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
  const ai = getAI();

  const response =
    await ai.chat.completions.create({
      model:
        aiConfig.defaultModel,

      messages: [
        {
          role: "system",
          content: `
Return ONLY valid JSON.

{
  "name":"",
  "email":"",
  "phone":"",
  "bio":"",
  "skills":[],
  "education":[],
  "experience":[],
  "projects":[]
}

Rules:
- No markdown
- No explanation
- No text outside JSON
- Skills must be string array
- Projects must be array
- Education must be array
- Experience must be array
`,
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
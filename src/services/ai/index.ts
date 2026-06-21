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
            "Rewrite the portfolio bio professionally while preserving facts. Return only the improved bio.",
        },
        {
          role: "user",
          content: bio,
        },
      ],
      temperature: 0.7,
    });

  return (
    response.choices[0]
      ?.message?.content
      ?.trim() ?? bio
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
Extract resume data and return ONLY valid JSON.

{
  "name":"",
  "email":"",
  "phone":"",
  "website":"",
  "bio":"",
  "title":"",
  "currentRole":"",
  "skills":[],
  "education":[],
  "experience":[],
  "projects":[],
  "codingProfiles":[],
  "socialLinks":[],
  "achievements":[],
  "certifications":[],
  "publications":[]
}

Rules:
- Return JSON only
- No markdown
- No explanation
- Missing values => empty string or []
- Preserve extracted data exactly
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0,
    });

  return (
    response.choices[0]
      ?.message?.content ?? "{}"
  );
}
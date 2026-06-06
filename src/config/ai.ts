export const aiConfig = {
  defaultModel:
    process.env.DEFAULT_AI_MODEL ??
    "deepseek/deepseek-chat-v3-0324:free",

  models: {
    deepseek:
      "deepseek/deepseek-chat-v3-0324:free",

    claude:
      "anthropic/claude-3.5-sonnet",

    gemini:
      "google/gemini-2.5-flash",

    gpt:
      "openai/gpt-4o-mini",
  },
};
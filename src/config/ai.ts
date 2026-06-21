export const aiConfig = {
  enabled: true,

  defaultModel:
    process.env.DEFAULT_AI_MODEL ??
    "google/gemini-2.5-flash",

  models: {
    deepseek:
      "deepseek/deepseek-chat-v3-0324",

    gemini:
      "google/gemini-2.5-flash",

    claude:
      "anthropic/claude-3.5-sonnet",

    gpt:
      "openai/gpt-4o-mini",
  },

  features: {
    resumeParsing: true,
    missingFieldDetection: true,
    portfolioCompletionAnalysis: true,

    portfolioContentGeneration: false,
    projectGeneration: false,
    bioGeneration: false,
    skillGeneration: false,
  },
} as const;

export type AIModel =
  (typeof aiConfig.models)[keyof typeof aiConfig.models];
import { buildPendingQuestions } from "@/services/resume/build-pending-questions";
import { calculateCompletionScore } from "@/services/resume/calculate-completion-score";
import { detectMissingFields } from "@/services/resume/detect-missing-fields";

import type { ParsedResume } from "@/types/parsed-resume";

export interface MissingFieldEngineResult {
  missingFields: string[];
  pendingQuestions: string[];
  completionScore: number;
  profileCompleted: boolean;
  publishReady: boolean;
}

export function missingFieldEngine(
  resume: ParsedResume
): MissingFieldEngineResult {
  const missingFields =
    detectMissingFields(resume);

  const pendingQuestions =
    buildPendingQuestions(
      missingFields
    );

  const completionScore =
    calculateCompletionScore(
      missingFields
    );

  return {
    missingFields,
    pendingQuestions,
    completionScore,
    profileCompleted:
      completionScore >= 80,
    publishReady:
      missingFields.length === 0,
  };
}
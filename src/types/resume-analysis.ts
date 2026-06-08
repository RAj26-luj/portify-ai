export interface ResumeAnalysis {
  completionScore: number;

  portfolioScore: number;

  missingFields: string[];

  questions: string[];

  strengths: string[];

  improvements: string[];

  category?: string;
}
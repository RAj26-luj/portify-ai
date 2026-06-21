export interface ResumeAnalysis {
  completionScore: number;

  portfolioScore: number;

  missingFields: string[];

  questions: string[];

  strengths: string[];

  improvements: string[];

  category?: string;

  extractedData?: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;

    skills?: string[];

    projects?: string[];

    education?: string[];

    experience?: string[];

    certifications?: string[];

    publications?: string[];

    codingProfiles?: string[];

    socialLinks?: string[];
  };
}

export interface MissingField {
  field: string;

  section: string;

  required: boolean;
}

export interface ResumeParseResult {
  success: boolean;

  analysis: ResumeAnalysis;

  error?: string;
}
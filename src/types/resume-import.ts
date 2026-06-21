import type { ParsedResume } from "./parsed-resume";

export interface ResumeFileData {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  thumbnailUrl?: string;
}

export interface ResumeImportInput {
  portfolioId: string;
  parsedResume: ParsedResume;
  resumeFile?: ResumeFileData;
}

export interface ResumeImportContext {
  portfolioId: string;
  parsedResume: ParsedResume;
  existingPortfolio?: unknown;
  existingData?: unknown;
}

export interface ResumeImportResult {
  success: boolean;
  portfolioId: string;

  completionScore: number;

  pendingFields: string[];

  pendingQuestions: string[];

  profileCompleted: boolean;

  publishReady: boolean;

  onboardingCompleted: boolean;

  imported: {
    portfolio: boolean;

    skills: number;
    skillCategories: number;

    educations: number;

    experiences: number;

    projects: number;
    projectMetrics: number;

    certifications: number;

    publications: number;

    achievements: number;

    socialLinks: number;

    codingProfiles: number;

    openSourceProjects: number;

    customSections: number;

    media: number;
  };

  resumeVersionId?: string;

  snapshotId?: string;
}

export interface MissingFieldResult {
  fields: string[];
  questions: string[];
  completionScore: number;
  profileCompleted: boolean;
  publishReady: boolean;
  onboardingCompleted: boolean;
}

export interface ChangeLogEntry {
  section: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
}

export interface ResumeMergeResult {
  parsedResume: ParsedResume;
  changes: ChangeLogEntry[];
}
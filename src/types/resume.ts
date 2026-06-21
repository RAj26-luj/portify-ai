export interface ParsedResume {
  name?: string;

  email?: string;

  phone?: string;

  website?: string;

  bio?: string;

  title?: string;

  currentRole?: string;

  skills: string[];

  education: {
    institution?: string;

    degree?: string;

    fieldOfStudy?: string;

    grade?: string;

    cgpa?: string;

    startDate?: string;

    endDate?: string;
  }[];

  experience: {
    company?: string;

    position?: string;

    description?: string;

    technologies?: string[];

    startDate?: string;

    endDate?: string;
  }[];

  projects: {
    title?: string;

    description?: string;

    techStack?: string[];

    githubUrl?: string;

    liveUrl?: string;
  }[];

  codingProfiles: {
    platform?: string;

    username?: string;

    profileUrl?: string;
  }[];

  socialLinks: {
    platform?: string;

    url?: string;
  }[];

  achievements: {
    title?: string;

    description?: string;

    issuer?: string;
  }[];

  certifications: {
    name?: string;

    issuer?: string;

    credentialUrl?: string;
  }[];

  publications: {
    title?: string;

    publicationUrl?: string;

    publisher?: string;
  }[];
}

export interface ResumeUploadResult {
  success: boolean;

  resumeUrl?: string;

  parsedData?: ParsedResume;

  error?: string;
}

export interface ResumeImportResult {
  success: boolean;

  portfolioId?: string;

  completionScore?: number;

  missingFields?: string[];

  error?: string;
}
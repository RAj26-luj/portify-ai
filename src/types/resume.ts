export interface ParsedResume {
  name?: string;

  email?: string;

  phone?: string;

  bio?: string;

  skills: string[];

  education: {
    institution?: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
  }[];

  experience: {
    company?: string;
    position?: string;
    description?: string;
  }[];

  projects: {
    title?: string;
    description?: string;
    techStack?: string[];
  }[];
}
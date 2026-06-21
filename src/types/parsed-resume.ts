export interface ParsedResumeProfile {
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  summary?: string;
  bio?: string;
  currentRole?: string;
  profileImage?: string;
  coverImage?: string;
  resumeHeadline?: string;
  availabilityStatus?: string;
  currentFocus?: string;
}

export interface ParsedResumeSkill {
  name: string;
  category?: string;
  proficiency?: string;
  yearsOfExperience?: number;
  description?: string;
  tag?: string;
}

export interface ParsedResumeEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  cgpa?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyStudying?: boolean;
  description?: string;
}

export interface ParsedResumeExperience {
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  companyWebsite?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
}

export interface ParsedResumeProjectMetric {
  label: string;
  value: string;
  description?: string;
}

export interface ParsedResumeProject {
  title: string;
  shortDescription?: string;
  description?: string;
  problemStatement?: string;
  solution?: string;
  category?: string;
  status?: string;
  type?: string;
  role?: string;
  teamSize?: number;
  startDate?: string;
  endDate?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  metrics?: ParsedResumeProjectMetric[];
}

export interface ParsedResumeCertification {
  name: string;
  issuer?: string;
  credentialId?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  skillsCovered?: string[];
}

export interface ParsedResumePublication {
  title: string;
  journal?: string;
  publisher?: string;
  publicationDate?: string;
  doi?: string;
  citations?: number;
  abstract?: string;
  publicationUrl?: string;
  pdfUrl?: string;
  conference?: string;
  authors?: string[];
}

export interface ParsedResumeAchievement {
  title: string;
  description?: string;
  issuer?: string;
  achievementDate?: string;
  certificateUrl?: string;
  rank?: string;
  position?: string;
}

export interface ParsedResumeSocialLink {
  platform: string;
  username?: string;
  url: string;
}

export interface ParsedResumeCodingProfile {
  platform: string;
  username: string;
  profileUrl: string;
  currentRating?: number;
  maxRating?: number;
  rank?: string;
  globalRank?: string;
  problemsSolved?: number;
  contestsAttended?: number;
}

export interface ParsedResumeOpenSource {
  repositoryName: string;
  repositoryUrl?: string;
  pullRequestUrl?: string;
  pullRequestTitle?: string;
  issueTitle?: string;
  contributionType?: string;
  description?: string;
  impactMetrics?: string[];
  linesChanged?: string;
  contributionTitle?: string;
}

export interface ParsedResume {
  profile: ParsedResumeProfile;

  skills: ParsedResumeSkill[];

  education: ParsedResumeEducation[];

  experience: ParsedResumeExperience[];

  projects: ParsedResumeProject[];

  certifications: ParsedResumeCertification[];

  publications: ParsedResumePublication[];

  achievements: ParsedResumeAchievement[];

  socialLinks: ParsedResumeSocialLink[];

  codingProfiles: ParsedResumeCodingProfile[];

  openSource: ParsedResumeOpenSource[];

  customSections?: Array<{
    title: string;
    subtitle?: string;
    description?: string;
    content?: string;
  }>;
}
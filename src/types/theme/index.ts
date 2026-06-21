import type { ThemeType } from "@prisma/client";
import type { Portfolio } from "@prisma/client";

export interface ThemeProps {
  portfolio: Portfolio & {
    skills?: any[];
    projects?: any[];
    experiences?: any[];
    educations?: any[];
    achievements?: any[];
    certifications?: any[];
    publications?: any[];
    codingProfiles?: any[];
    socialLinks?: any[];
    customSections?: any[];
    openSourceProjects?: any[];
    testimonials?: any[];
  };
}

export interface PortfolioTheme {
  id: ThemeType;

  name: string;

  description?: string;

  Hero: React.ComponentType<ThemeProps>;

  About: React.ComponentType<ThemeProps>;

  Skills?: React.ComponentType<ThemeProps>;

  Projects?: React.ComponentType<ThemeProps>;

  Experience?: React.ComponentType<ThemeProps>;

  Education?: React.ComponentType<ThemeProps>;

  Achievements?: React.ComponentType<ThemeProps>;

  Certifications?: React.ComponentType<ThemeProps>;

  Publications?: React.ComponentType<ThemeProps>;

  CodingProfiles?: React.ComponentType<ThemeProps>;

  OpenSource?: React.ComponentType<ThemeProps>;

  Testimonials?: React.ComponentType<ThemeProps>;

  CustomSections?: React.ComponentType<ThemeProps>;

  Contact: React.ComponentType<ThemeProps>;
}

export interface ThemeMetadata {
  id: ThemeType;

  name: string;

  description: string;

  layout: string;
}
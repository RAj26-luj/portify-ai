import { validateParsedResume } from "@/services/resume/validate-parsed-resume";

import { normalizeResumeData } from "@/services/resume/normalize-resume-data";

describe("Parsed Resume", () => {
  it("should normalize empty arrays", () => {
    const resume = normalizeResumeData({
      profile: {},
    } as never);

    expect(resume.skills).toEqual([]);

    expect(resume.projects).toEqual([]);

    expect(resume.education).toEqual([]);

    expect(resume.experience).toEqual([]);
  });

  it("should validate valid resume", () => {
    const result = validateParsedResume({
      profile: {
        fullName: "Raj Kumar",
        email: "raj@test.com",
      },
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      publications: [],
      achievements: [],
      socialLinks: [],
      codingProfiles: [],
      openSource: [],
    });

    expect(result).toBeDefined();
  });

  it("should reject invalid resume", () => {
    expect(() => validateParsedResume({} as never)).toThrow();
  });
});

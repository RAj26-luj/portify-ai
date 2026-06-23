import { missingFieldEngine } from "@/services/resume/missing-field-engine";

describe("Missing Field Engine", () => {
  it("should detect missing profile information", () => {
    const result = missingFieldEngine({
      profile: {},

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

    expect(result.missingFields).toContain("profileImage");

    expect(result.missingFields).toContain("resumeHeadline");

    expect(result.publishReady).toBe(false);
  });

  it("should mark portfolio ready when required fields exist", () => {
    const result = missingFieldEngine({
      profile: {
        bio: "Developer",
        profileImage: "https://example.com/profile.png",
        resumeHeadline: "Full Stack Developer",
      },

      skills: [
        {
          name: "TypeScript",
        },
      ],

      education: [
        {
          institution: "NIT Rourkela",
          degree: "B.Tech",
        },
      ],

      experience: [
        {
          company: "Portify AI",
          position: "Developer",
        },
      ],

      projects: [
        {
          title: "Portify AI",
          description: "Portfolio Builder",
        },
      ],

      socialLinks: [
        {
          platform: "GitHub",
          url: "https://github.com/test",
        },
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/test",
        },
      ],

      certifications: [],

      publications: [],

      achievements: [],

      codingProfiles: [
        {
          platform: "GitHub",
          username: "raj",
          profileUrl: "https://github.com/raj",
        },
      ],

      openSource: [],
    });

    expect(result.missingFields.length).toBe(0);

    expect(result.publishReady).toBe(true);

    expect(result.profileCompleted).toBe(true);
  });

  it("should generate pending questions", () => {
    const result = missingFieldEngine({
      profile: {},

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

    expect(result.pendingQuestions.length).toBeGreaterThan(0);
  });
});

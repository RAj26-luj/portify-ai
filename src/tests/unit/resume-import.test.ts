import { missingFieldEngine } from "@/services/resume/missing-field-engine";

describe("Resume Import", () => {
  it("should calculate completion for a complete resume", () => {
    const result = missingFieldEngine({
      profile: {
        fullName: "Raj Kumar",
        email: "raj@test.com",
        bio: "Developer",
        profileImage: "https://image.com/profile.png",
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
          company: "Portify",
          position: "Developer",
        },
      ],

      projects: [
        {
          title: "Portify AI",
          description: "Portfolio Builder",
        },
      ],

      certifications: [],

      publications: [],

      achievements: [],

      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com/in/test",
        },
        {
          platform: "GitHub",
          url: "https://github.com/test",
        },
      ],

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
  });

  it("should detect missing fields", () => {
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

    expect(result.missingFields.length).toBeGreaterThan(0);

    expect(result.publishReady).toBe(false);
  });
});

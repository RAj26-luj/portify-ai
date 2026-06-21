import { analyzeResume } from "@/services/resume/analyze";

describe("analyzeResume", () => {
  it("should detect missing fields", () => {
    const result = analyzeResume({
      skills: [],
      education: [],
      experience: [],
      projects: [],
      codingProfiles: [],
      socialLinks: [],
      achievements: [],
      certifications: [],
      publications: [],
    });

    expect(result.missingFields).toContain("name");
    expect(result.missingFields).toContain("email");
    expect(result.completionScore).toBeLessThan(100);
  });

  it("should score complete resume", () => {
    const result = analyzeResume({
      name: "Raj Kumar Sharma",
      email: "raj@test.com",
      phone: "1234567890",
      bio: "Full Stack Developer",

      skills: ["C++", "React", "Node.js", "MongoDB", "Next.js"],

      education: [
        { institution: "NIT Rourkela", degree: "B.Tech" },
      ],

      experience: [
        {
          company: "ABC",
          position: "Intern",
          description: "Backend",
        },
      ],

      projects: [
        {
          title: "Portify AI",
          description: "Portfolio Builder",
          techStack: ["Next.js"],
        },
      ],

      codingProfiles: [
        { platform: "Codeforces", username: "raj" },
      ],

      socialLinks: [
        { platform: "GitHub", url: "https://github.com/raj" },
      ],

      achievements: [{ title: "Codeforces Specialist" }],

      certifications: [{ name: "AWS Certified" }],

      publications: [{ title: "AI Research" }],
    });

    expect(result.completionScore).toBeGreaterThan(70);
    expect(result.portfolioScore).toBeGreaterThan(70);
    expect(result.missingFields.length).toBe(0);
  });
});
import { normalizeResumeData } from "@/services/resume/normalize-resume-data";

describe(
  "Resume Mapper",
  () => {
    it(
      "should normalize mapped resume data",
      () => {
        const resume =
          normalizeResumeData({
            profile: {
              fullName:
                "Raj Kumar",
              email:
                "raj@test.com",
            },
          } as never);

        expect(
          resume.profile.fullName
        ).toBe(
          "Raj Kumar"
        );

        expect(
          resume.profile.email
        ).toBe(
          "raj@test.com"
        );

        expect(
          resume.skills
        ).toEqual([]);

        expect(
          resume.projects
        ).toEqual([]);
      }
    );

    it(
      "should keep parsed arrays",
      () => {
        const resume =
          normalizeResumeData({
            profile: {},
            skills: [
              {
                name:
                  "TypeScript",
              },
            ],
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

        expect(
          resume.skills
            .length
        ).toBe(1);

        expect(
          resume.skills[0]
            .name
        ).toBe(
          "TypeScript"
        );
      }
    );
  }
);
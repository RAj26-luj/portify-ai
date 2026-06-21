export function buildPendingQuestions(
  missingFields: string[]
): string[] {
  return missingFields.map((field) => {
    switch (field) {
      case "profileImage":
        return "Please upload a profile image.";

      case "resumeHeadline":
        return "Please add a resume headline.";

      case "bio":
        return "Please add a short bio or summary.";

      case "skills":
        return "Please add your skills.";

      case "projects":
        return "Please add at least one project.";

      case "projectDescription":
        return "Please add descriptions for your projects.";

      case "education":
        return "Please add your education details.";

      case "experience":
        return "Please add your work experience.";

      case "github":
        return "Please add your GitHub profile.";

      case "linkedin":
        return "Please add your LinkedIn profile.";

      case "socialLinks":
        return "Please add your social links.";

      case "codingProfiles":
        return "Please add your coding profiles.";

      case "certifications":
        return "Please add your certifications.";

      case "publications":
        return "Please add your publications.";

      case "achievements":
        return "Please add your achievements.";

      default:
        return `Please complete ${field}.`;
    }
  });
}
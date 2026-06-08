import type {
  ParsedResume,
} from "@/types/resume";

import type {
  ResumeAnalysis,
} from "@/types/resume-analysis";

export function analyzeResume(
  data: ParsedResume
): ResumeAnalysis {
  const missingFields:
    string[] = [];

  const questions:
    string[] = [];

  let score = 100;

  if (!data.name) {
    score -= 10;

    missingFields.push(
      "name"
    );

    questions.push(
      "What is your full name?"
    );
  }

  if (!data.email) {
    score -= 10;

    missingFields.push(
      "email"
    );

    questions.push(
      "What is your email address?"
    );
  }

  if (!data.phone) {
    score -= 5;

    missingFields.push(
      "phone"
    );

    questions.push(
      "What is your phone number?"
    );
  }

  if (!data.bio) {
    score -= 10;

    missingFields.push(
      "bio"
    );

    questions.push(
      "Tell us about yourself."
    );
  }

  if (
    data.skills.length === 0
  ) {
    score -= 15;

    missingFields.push(
      "skills"
    );

    questions.push(
      "What technical skills do you have?"
    );
  }

  if (
    data.education.length ===
    0
  ) {
    score -= 15;

    missingFields.push(
      "education"
    );

    questions.push(
      "Please add your education details."
    );
  }

  if (
    data.projects.length === 0
  ) {
    score -= 20;

    missingFields.push(
      "projects"
    );

    questions.push(
      "Please add at least one project."
    );
  }

  if (
    data.experience.length ===
    0
  ) {
    score -= 15;

    missingFields.push(
      "experience"
    );

    questions.push(
      "Do you have any work, internship, research, or freelance experience?"
    );
  }

  const strengths:
    string[] = [];

  const improvements:
    string[] = [];

  if (
    data.skills.length >= 5
  ) {
    strengths.push(
      "Strong skill coverage"
    );
  }

  if (
    data.skills.length >= 10
  ) {
    strengths.push(
      "Excellent technical breadth"
    );
  } else if (
    data.skills.length < 3
  ) {
    improvements.push(
      "Add more technical skills"
    );
  }

  if (
    data.projects.length >= 3
  ) {
    strengths.push(
      "Good project portfolio"
    );
  }

  if (
    data.projects.length >= 5
  ) {
    strengths.push(
      "Excellent project showcase"
    );
  } else if (
    data.projects.length < 2
  ) {
    improvements.push(
      "Add more projects"
    );
  }

  if (
    data.experience.length > 0
  ) {
    strengths.push(
      "Has professional experience"
    );
  } else {
    improvements.push(
      "Add internship, freelance, research, or work experience"
    );
  }

  if (data.bio) {
    strengths.push(
      "Professional summary available"
    );
  } else {
    improvements.push(
      "Add a professional bio"
    );
  }

  if (
    data.education.length > 0
  ) {
    strengths.push(
      "Education details available"
    );
  } else {
    improvements.push(
      "Add education details"
    );
  }

  const portfolioScore =
    Math.max(
      Math.min(
        score +
          strengths.length *
            2,
        100
      ),
      0
    );

  return {
  completionScore:
    Math.max(score, 0),

  portfolioScore,

  missingFields,

  questions,

  strengths,

  improvements,

  category:
    data.experience.length === 0
      ? "STUDENT"
      : "WORKING_PROFESSIONAL",
};
}
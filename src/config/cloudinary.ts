export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",

  folder: {
    profiles: "portify/profiles",
    covers: "portify/covers",
    resumes: "portify/resumes",
    projects: "portify/projects",
    certificates: "portify/certificates",
    publications: "portify/publications",
    media: "portify/media",
    testimonials: "portify/testimonials",
    icons: "portify/icons",
    customSections: "portify/custom-sections",
    openSource: "portify/open-source",
  },

  allowedImageFormats: [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "svg",
  ],

  allowedDocumentFormats: [
    "pdf",
  ],

  maxImageSize: 5 * 1024 * 1024,

  maxResumeSize: 10 * 1024 * 1024,

  transformations: {
    profile: {
      width: 500,
      height: 500,
      crop: "fill",
    },

    cover: {
      width: 1600,
      height: 900,
      crop: "fill",
    },

    project: {
      width: 1200,
      height: 800,
      crop: "fill",
    },
  },
} as const;
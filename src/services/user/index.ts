import { prisma } from "@/lib/prisma";
import type { ProfileUpdateDTO } from "@/validators/profile";
import bcrypt from "bcryptjs";

export async function getProfile(identifier: string) {
  if (!identifier) return null;

  const isObjectId = /^[a-f\d]{24}$/i.test(identifier);

  return prisma.user.findUnique({
    where: isObjectId ? { id: identifier } : { username: identifier },
    include: {
      portfolio: true,
    },
  });
}

export async function getDashboardUser(username: string) {
  if (!username) return null;

  return prisma.user.findUnique({
    where: { username },
    include: {
      portfolio: true,
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getUserById(userId: string) {
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      portfolio: true,
    },
  });
}

export async function updateProfile(userId: string, data: ProfileUpdateDTO) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId },
  });

  if (!portfolio) return null;

  const userImage = data.image?.trim() ? data.image : user.image;

  const coverImage = data.coverImage?.trim() ? data.coverImage : user.coverImage;

  const profileImage = data.profileImage?.trim() ? data.profileImage : portfolio.profileImage;

  const portfolioCover = data.coverPortfolioImage?.trim()
    ? data.coverPortfolioImage
    : data.coverImage?.trim()
      ? data.coverImage
      : portfolio.coverImage;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name ?? undefined,
      phone: data.phone ?? undefined,
      image: userImage ?? undefined,
      coverImage: coverImage ?? undefined,
      website: data.website ?? undefined,
      country: data.country ?? undefined,
      state: data.state ?? undefined,
      city: data.city ?? undefined,
    },
  });

  await prisma.portfolio.update({
    where: { userId: user.id },
    data: {
      title: data.title ?? undefined,
      tagline: data.tagline ?? undefined,
      bio: data.bio ?? undefined,

      profileImage: profileImage ?? undefined,
      coverImage: portfolioCover ?? undefined,

      resumeHeadline: data.resumeHeadline ?? undefined,
      currentRole: data.currentRole ?? undefined,

      email: data.emailPortfolio ?? undefined,
      phone: data.phonePortfolio ?? undefined,
      website: data.websitePortfolio ?? undefined,
      country: data.countryPortfolio ?? undefined,
      state: data.statePortfolio ?? undefined,
      city: data.cityPortfolio ?? undefined,

      timezone: data.timezone ?? undefined,

      allowContactForm: data.allowContactForm ?? portfolio.allowContactForm,

      allowResumeDownload: data.allowResumeDownload ?? portfolio.allowResumeDownload,

      seoTitle: data.seoTitle ?? undefined,
      seoDescription: data.seoDescription ?? undefined,
      seoKeywords: data.seoKeywords ?? undefined,
      seoImage: data.seoImage ?? undefined,

      ogTitle: data.ogTitle ?? undefined,
      ogSubtitle: data.ogSubtitle ?? undefined,
      ogDescription: data.ogDescription ?? undefined,
      ogImage: data.ogImage ?? undefined,

      primaryButtonText: data.primaryButtonText ?? undefined,

      primaryButtonUrl: data.primaryButtonUrl ?? undefined,

      secondaryButtonText: data.secondaryButtonText ?? undefined,

      secondaryButtonUrl: data.secondaryButtonUrl ?? undefined,

      currentFocus: data.currentFocus ?? undefined,

      availabilityStatus: data.availabilityStatus ?? undefined,

      aboutImage: data.aboutImage ?? undefined,

      contactAvailability: data.contactAvailability ?? undefined,

      twitterImage: data.twitterImage ?? undefined,

      description: data.description ?? undefined,

      heroIntroduction: data.heroIntroduction ?? undefined,
    },
  });

  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      portfolio: true,
    },
  });
}

export async function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string
) {
  if (!username) return null;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user?.password) return null;

  const valid = await bcrypt.compare(currentPassword, user.password);

  if (!valid) return null;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
}

export async function deleteAccount(username: string) {
  if (!username) return null;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      portfolio: true,
    },
  });

  if (!user) return null;

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  return {
    success: true,
  };
}

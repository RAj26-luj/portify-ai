// src/components/theme/SkeletonLoader.tsx

import DefaultSkeleton from "@/themes/default/loaders/SkeletonLoader";
import DarkSkeleton from "@/themes/dark/loaders/SkeletonLoader";
import DeveloperSkeleton from "@/themes/developer/loaders/SkeletonLoader";
import MinimalSkeleton from "@/themes/minimal/loaders/SkeletonLoader";
import ModernSkeleton from "@/themes/modern/components/loaders/SkeletonLoader";

interface Props {
  theme?: string;
}

export default function ThemeSkeleton({ theme = "default" }: Props) {
  switch (theme) {
    case "dark":
      return <DarkSkeleton />;

    case "developer":
      return <DeveloperSkeleton />;

    case "minimal":
      return <MinimalSkeleton />;

    case "modern":
      return <ModernSkeleton />;

    default:
      return <DefaultSkeleton />;
  }
}

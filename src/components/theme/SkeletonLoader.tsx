import DefaultSkeleton from "@/themes/default/loaders/SkeletonLoader";
// import ModernSkeleton ...
// import MinimalSkeleton ...

export default function ThemeSkeleton({
  theme,
}: {
  theme?: string;
}) {
  switch (theme) {
    case "default":
      return <DefaultSkeleton />;

    default:
      return <DefaultSkeleton />;
  }
}
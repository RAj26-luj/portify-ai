export function buildSeo({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return {
    title:
      title ?? "Portify AI",

    description:
      description ??
      "AI Portfolio Builder",
  };
}
const TOTAL_CHECKS = 10;

export function calculateCompletionScore(
  missingFields: string[]
): number {
  const uniqueMissingFields = [
    ...new Set(missingFields),
  ];

  const completed =
    TOTAL_CHECKS -
    Math.min(
      uniqueMissingFields.length,
      TOTAL_CHECKS
    );

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (completed / TOTAL_CHECKS) * 100
      )
    )
  );
}
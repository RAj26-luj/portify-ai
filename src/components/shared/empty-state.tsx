interface Props {
  message: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  message,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border p-8 text-center">
      <h3 className="text-sm font-medium">{message}</h3>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
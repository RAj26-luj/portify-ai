interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
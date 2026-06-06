interface Props {
  title: string;
  description?: string;
}

export default function PageHeader({
  title,
  description,
}: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}
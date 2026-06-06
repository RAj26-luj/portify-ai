interface Props {
  message: string;
}

export default function EmptyState({
  message,
}: Props) {
  return (
    <div className="rounded-xl border p-6 text-center">
      {message}
    </div>
  );
}
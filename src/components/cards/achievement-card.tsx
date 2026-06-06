interface Props {
  title: string;
}

export default function AchievementCard({
  title,
}: Props) {
  return (
    <div className="rounded-xl border p-4">
      {title}
    </div>
  );
}
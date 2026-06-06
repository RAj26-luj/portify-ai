interface Props {
  name: string;
}

export default function SkillCard({
  name,
}: Props) {
  return (
    <div className="rounded-lg border p-2">
      {name}
    </div>
  );
}
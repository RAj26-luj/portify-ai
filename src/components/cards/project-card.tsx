interface Props {
  title: string;
  description: string;
}

export default function ProjectCard({
  title,
  description,
}: Props) {
  return (
    <div className="rounded-xl border p-4">
      <h3 className="font-bold">
        {title}
      </h3>

      <p>{description}</p>
    </div>
  );
}
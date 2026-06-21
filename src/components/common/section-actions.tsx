"use client";

type Props = {
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
};

export default function SectionActions({
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
}: Props) {
  return (
    <div className="flex gap-2 text-xs">
      {onCreate && (
        <button onClick={onCreate} className="px-2 py-1 border rounded">
          Create
        </button>
      )}

      {onEdit && (
        <button onClick={onEdit} className="px-2 py-1 border rounded">
          Edit
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} className="px-2 py-1 border rounded text-red-600">
          Delete
        </button>
      )}

      {onRefresh && (
        <button onClick={onRefresh} className="px-2 py-1 border rounded text-blue-600">
          Refresh
        </button>
      )}
    </div>
  );
}
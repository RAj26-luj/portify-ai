"use client";

import SectionActions from "./section-actions";

type Props<T> = {
  title: string;
  loading: boolean;
  items: T[];
  renderItem: (item: T) => React.ReactNode;

  onCreate: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
};

export default function SectionGrid<T extends { id: string }>({
  title,
  loading,
  items,
  renderItem,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
}: Props<T>) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>

        <SectionActions
          onCreate={onCreate}
          onRefresh={onRefresh}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No data found</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border p-4 rounded-xl space-y-2">
              {renderItem(item)}

              <SectionActions
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
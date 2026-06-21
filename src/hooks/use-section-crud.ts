"use client";

import { useState } from "react";

export function useSectionCrud<
  T extends {
    id: string;
  }
>() {
  const [items, setItems] =
    useState<T[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<T | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  async function load(
    fetcher: () => Promise<T[]>
  ) {
    try {
      setLoading(true);

      const data =
        await fetcher();

      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function create(
    action: () => Promise<T>
  ) {
    try {
      setSaving(true);

      const created =
        await action();

      setItems((prev) => [
        ...prev,
        created,
      ]);

      setShowForm(false);
      setSelectedItem(null);

      return created;
    } finally {
      setSaving(false);
    }
  }

  async function update(
    id: string,
    action: () => Promise<T>
  ) {
    try {
      setSaving(true);

      const updated =
        await action();

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? updated
            : item
        )
      );

      setShowForm(false);
      setSelectedItem(null);

      return updated;
    } finally {
      setSaving(false);
    }
  }

  async function remove(
    id: string,
    action: () => Promise<unknown>
  ) {
    try {
      setDeleting(true);

      await action();

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
      );

      if (
        selectedItem?.id === id
      ) {
        setSelectedItem(null);
        setShowForm(false);
      }
    } finally {
      setDeleting(false);
    }
  }

  function openCreate() {
    setSelectedItem(null);
    setShowForm(true);
  }

  function openEdit(
    item: T
  ) {
    setSelectedItem(item);
    setShowForm(true);
  }

  function closeForm() {
    setSelectedItem(null);
    setShowForm(false);
  }

  function reset() {
    setItems([]);
    setSelectedItem(null);
    setShowForm(false);
  }

  return {
    items,
    setItems,

    loading,
    saving,
    deleting,

    selectedItem,
    showForm,

    load,
    create,
    update,
    remove,

    openCreate,
    openEdit,
    closeForm,

    reset,
  };
}
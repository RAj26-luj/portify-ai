export async function createSection(section: string, data: any) {
  const res = await fetch("/api/portfolio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      section,
      data,
    }),
  });

  const json = await res.json();

  return json;
}

export async function updateSection(section: string, id: string, data: any) {
  const res = await fetch("/api/portfolio", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      section,
      id,
      data,
    }),
  });

  const json = await res.json();

  return json;
}

export async function deleteSection(section: string, id: string) {
  const res = await fetch("/api/portfolio", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      section,
      id,
    }),
  });

  const json = await res.json();

  return json;
}
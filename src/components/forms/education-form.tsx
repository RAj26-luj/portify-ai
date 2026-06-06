"use client";

import { useState } from "react";

export default function EducationForm() {
  const [
    institution,
    setInstitution,
  ] = useState("");

  const [degree, setDegree] =
    useState("");

  return (
    <form className="space-y-4">
      <input
        value={institution}
        onChange={(e) =>
          setInstitution(
            e.target.value
          )
        }
        placeholder="Institution"
        className="w-full rounded border p-3"
      />

      <input
        value={degree}
        onChange={(e) =>
          setDegree(e.target.value)
        }
        placeholder="Degree"
        className="w-full rounded border p-3"
      />

      <button
        type="submit"
        className="rounded border px-4 py-2"
      >
        Save
      </button>
    </form>
  );
}
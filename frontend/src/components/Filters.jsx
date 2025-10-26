import React, { useState } from "react";

export default function Filters({ columns, onChange }) {
  const [local, setLocal] = useState({});

  const update = (col, val) => {
    const next = { ...local, [col]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {columns?.map((c) => (
        <input
          key={c}
          placeholder={c}
          className="border p-1 rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => update(c, e.target.value)}
        />
      ))}
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function DataTable({ datasetId, filters }) {
  const { token } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);

  const fetchData = async () => {
    if (!datasetId) return;
    try {
      const fstr = filters ? JSON.stringify(filters) : undefined;
      const res = await API.get(`/datasets/${datasetId}/data`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { filters: fstr, skip: page * limit, limit },
      });
      setRows(res.data.rows);
      setCols(res.data.columns);
    } catch (err) {
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [datasetId, filters, page]);

  if (!rows.length) return <div>No rows to show</div>;

  return (
    <div className="overflow-auto border rounded">
      <table className="min-w-full border">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                className="border px-2 py-1 text-left sticky top-0"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-gray-50 dark:odd:bg-gray-800">
              {cols.map((c) => (
                <td key={c} className="border px-2 py-1">
                  {String(r[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between p-2">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="p-1 border rounded"
        >
          Prev
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} className="p-1 border rounded">
          Next
        </button>
      </div>
    </div>
  );
}

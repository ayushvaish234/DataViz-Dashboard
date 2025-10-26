import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function FileUploader({ onUploaded }) {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return alert("Choose a file");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await API.post("/datasets/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
     
      onUploaded(res.data.dataset_id, res.data.columns);
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="p-3 border rounded flex gap-2 items-center">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".csv,.xlsx,.xls"
      />
      <button onClick={upload} className="bg-green-600 text-white p-2 rounded">
        Upload
      </button>
    </div>
  );
}

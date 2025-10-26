import React, { useState, useContext, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import FileUploader from "./components/FileUploader";
import DataTable from "./components/DataTable";
import ChartView from "./components/ChartView";
import Filters from "./components/Filters";
import ThemeToggle from "./components/ThemeToggle";
import { AuthContext } from "./context/AuthContext";
import API from "./services/api";

export default function App() {
  const { token, role, logout } = useContext(AuthContext);
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartX, setChartX] = useState("");
  const [chartY, setChartY] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [allDatasets, setAllDatasets] = useState([]);

  useEffect(() => {
    if (role === "Admin") {
      const fetchAll = async () => {
        try {
          const res = await API.get("/datasets/all", { headers: { Authorization: `Bearer ${token}` } });
          setAllDatasets(res.data);
        } catch (err) { console.error(err); }
      };
      fetchAll();
    }
  }, [role, token]);
useEffect(() => {
  if (!token) return;

  const fetchUserDatasets = async () => {
    try {
      const res = await API.get("/datasets/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllDatasets(res.data);  // store datasets in state
      if (res.data.length > 0 && !datasetId) setDatasetId(res.data[0].id); // auto-select first dataset
    } catch (err) {
      console.error(err);
    }
  };

  fetchUserDatasets();
}, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dataset?")) return;
    try {
      await API.delete(`/datasets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setAllDatasets(prev => prev.filter(ds => ds.id !== id));
      if (datasetId === id) setDatasetId(null);
      alert("Dataset deleted successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 p-6 space-y-6 font-sans">

      {/* Top Bar */}
      {/* Top Bar */}
<header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-lg z-50">
  <div className="flex justify-between items-center py-4 px-6">
    <h1 className="text-2xl font-bold">DataViz Dashboard</h1>
    <div className="flex gap-2 items-center">
      <ThemeToggle />
      {token && (
        <button
          onClick={logout}
          className="p-2 border rounded bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
        >
          Logout
        </button>
      )}
    </div>
  </div>
</header>

{/* Main content */}
<main className="pt-20">

</main>


      {!token ? (
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <AuthForm />
          </div>
        </div>
      ) : (
        <>
          {/* File Uploader */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <FileUploader 
              onUploaded={(id, cols) => {
                setDatasetId(id);
                setColumns(cols?.map(c => c.name) || []);
                if (cols && cols.length) setChartX(cols[0].name);
                setFilters({});
              }}
            />
          </div>

          {/* Chart Card */}
          {datasetId && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Chart</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                
                {/* X-Axis */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">X-Axis:</label>
                  <select 
                    value={chartX} 
                    onChange={e => setChartX(e.target.value)} 
                    className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select X</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Y-Axis */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Y-Axis (optional):</label>
                  <select 
                    value={chartY} 
                    onChange={e => setChartY(e.target.value)} 
                    className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Y</option>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Chart Type */}
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Chart Type:</label>
                  <select 
                    value={chartType} 
                    onChange={e => setChartType(e.target.value)} 
                    className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                  </select>
                </div>
              </div>

              <ChartView datasetId={datasetId} x={chartX} y={chartY} type={chartType} filters={filters} />
            </div>
          )}

          {/* Filters Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <Filters columns={columns} onChange={setFilters} />
          </div>

          {/* Data Table Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Data Table</h3>
            <DataTable datasetId={datasetId} filters={filters} />
          </div>

          {/* Admin Card */}
          {role === "Admin" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">All Datasets (Admin)</h3>
              <table className="min-w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Filename</th>
                    <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">Rows</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allDatasets.map(ds => (
                    <tr key={ds.id} className="odd:bg-gray-50 dark:odd:bg-gray-700">
                      <td className="px-4 py-2">{ds.id}</td>
                      <td className="px-4 py-2">{ds.filename}</td>
                      <td className="px-4 py-2">{ds.user_id}</td>
                      <td className="px-4 py-2">{ds.rows_count}</td>
                      <td className="px-4 py-2">
                        <button 
                          onClick={() => handleDelete(ds.id)} 
                          className="p-2 border rounded bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allDatasets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No datasets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

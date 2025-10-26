import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#F97316", "#10B981", "#EF4444", "#8B5CF6"];

export default function ChartView({ datasetId, x, y, type = "bar", filters }) {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!datasetId || !x) return;

    const fetchData = async () => {
      try {
        const fstr = filters ? JSON.stringify(filters) : undefined;
        const res = await API.get(`/datasets/${datasetId}/chart`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { x, y, agg: y ? "sum" : "count", filters: fstr },
        });

        // convert numeric values if possible
        const formatted = res.data.labels.map((lab, i) => {
          let val = res.data.values[i];
          if (!isNaN(Number(val))) val = Number(val);
          return { name: lab, value: val };
        });

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [datasetId, x, y, filters]);

  if (!data.length) return <div>No chart data</div>;

  if (type === "line")
    return (
      <LineChart width={700} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#4F46E5" />
      </LineChart>
    );
if (type === "pie") {
  return (
    <PieChart width={500} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [value, "Count"]} />
    </PieChart>
  );
}


  return (
    <BarChart width={700} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#4F46E5" />
    </BarChart>
  );
}

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [score, setScore] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Relative URL works with Vite proxy
      const res = await fetch("http://localhost:5001/api/happiness");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Check backend or proxy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit new happiness score
  const submit = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/happiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, date }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchData();
    } catch (err) {
      console.error("Failed to save data:", err);
      setError("Failed to save data");
    }
  };

  // Prepare chart data
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Happiness Score",
        data: data.map(d => d.score),
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  // Determine best day
  const bestDay = data.length > 0
    ? data.reduce((a, b) => (a.score > b.score ? a : b))
    : null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Happiness Tracker</h1>

      <div className="mb-2">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mr-2 p-1 border rounded"
        />
        <input
          type="number"
          min="1"
          max="10"
          value={score}
          onChange={e => setScore(Number(e.target.value))}
          className="mr-2 p-1 border rounded"
        />
        <button
          onClick={submit}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p>Loading data...</p>}

      {data.length > 0 ? (
        <Line data={chartData} style={{ height: '300px' }} />
      ) : (
        !loading && <p>No data to display yet.</p>
      )}

      {bestDay && <p className="mt-2">Best Day: {bestDay.date} (Score {bestDay.score})</p>}
    </div>
  );
}

export default App;
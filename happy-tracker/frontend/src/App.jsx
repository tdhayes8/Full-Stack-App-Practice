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
  const [diary, setDiary] = useState("");
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
        body: JSON.stringify({ score, date , diary}),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchData();
    } catch (err) {
      console.error("Failed to save data:", err);
      setError("Failed to save data");
    }
  };

  // Prepare chart data
  const labels = data.map(d => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const chartData = {
    
    labels: labels,
    datasets: [
      {
        label: "Happiness Score",
        data: data.map(d => d.score),
        diary: data.map(d => d.diary),
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  // Determine best day
  const bestDay = data.length > 0
    ? data.reduce((a, b) => (a.score > b.score ? a : b))
    : null;

    const chartOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const diaryText = context.dataset.diary[context.dataIndex];
              return `Score: ${context.parsed.y}${diaryText ? ` — ${diaryText}` : ""}`;
            }
          }
        }
      }
    };
  
  return (
    <div className="container py-5">
      {/* <h1 className="text-xl font-bold mb-2">Happiness Tracker</h1> */}
      <header className="bg-primary text-white shadow-sm mb-4">
        <div className="container py-4 text-center">
        <h1 className="fw-bold display-5">😊 Happiness Tracker</h1>
        <p className="lead mb-0">
        Log your mood, track your progress, and celebrate your best days ✨
    </p>
  </div>
</header>

      {/* <div className="mb-2">
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
      </div> */}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Log Today’s Mood</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-control"
              />
            </div>
            <div className="col-md-6">
              <textarea
              value={diary}
              onChange={e => setDiary(e.target.value)}
              placeholder="How was your day? (optional)"
              className="form-control"
            /></div>
            <div className="col-md-2">
              <input
              type="number"
              min="1"
              max="10"
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="form-control"
            /></div>
            <div className="col-md-2 d-grid">
              <button
              onClick={submit}
              className="btn btn-primary"
              >
              Save
            </button>
            </div>
          </div>
        </div>
        </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p>Loading data...</p>}

      <div className="card shadow-sm p-3">
        {data.length > 0 ? <Line data={chartData} options={chartOptions} /> : <p className="text-center">No data yet.</p>}
      </div>
        

      {bestDay && (
        <div className="mt-3">
          <h6 className="fst-italic">
            Best Day:{" "}
            <span className="fw-bold">
              {new Date(bestDay.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>{" "}
            (Score: {bestDay.score})
          </h6>
          {bestDay.diary && (
            <p className="text-muted mb-0">
              "{bestDay.diary}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
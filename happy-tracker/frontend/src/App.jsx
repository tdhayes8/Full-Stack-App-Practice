import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

function App() {
  const [score, setScore] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/happiness");
    setData(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const submit = async () => {
    await fetch("http://localhost:5000/api/happiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, date }),
    });
    fetchData();
  };

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

  const bestDay = data.reduce((a, b) => (a.score > b.score ? a : b), {});

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Happiness Tracker</h1>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="number" min="1" max="10" value={score} onChange={e => setScore(Number(e.target.value))} />
      <button onClick={submit}>Save</button>
      <Line data={chartData} />
      {bestDay.date && <p>Best Day: {bestDay.date} (Score {bestDay.score})</p>}
    </div>
  );
}

export default App;

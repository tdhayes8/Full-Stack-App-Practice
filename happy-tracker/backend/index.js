const express = require('express');
const pool = require('./db/db');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/happiness', async (req, res) => {
    const { date, score } = req.body;
    try { 
        const result = await pool.query(
            `INSERT INTO happiness (date, score) 
            VALUES ($1, $2) ON CONFLICT (date)
            DO UPDATE SET score = EXCLUDED.score
            RETURNING *`,
            [date, score]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/happiness', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM happiness 
            WHERE date >= NOW() - INTERVAL '30 days'
            ORDER BY date asc`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(5000, () => console.log('Server running on port 5000'));
        
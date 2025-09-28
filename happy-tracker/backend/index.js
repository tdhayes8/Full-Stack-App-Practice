const express = require('express');
const pool = require('./db/db.js');
const cors = require('cors');


const app = express();
app.use(cors());


app.use(express.json());

app.post('/api/happiness', async (req, res) => {
    let { date, score } = req.body;

    // Validate data
    if (!date || !score) {
        return res.status(400).json({ error: 'Date and score are required' });
    }

    // Convert score to a number if it's not already
    score = Number(score);

    if (isNaN(score) || score < 0 || score > 10) {
        return res.status(400).json({ error: 'Score must be a number between 0 and 10' });
    }

    // Attempt to parse the date, and return an error if it's invalid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    // Format the date to ISO 8601 format
    date = parsedDate.toISOString();

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
app.listen(5001, () => console.log('Server running on port 5000'));
        
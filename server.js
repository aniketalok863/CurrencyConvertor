const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import PostgreSQL Pool
const app = express();

app.use(cors()); // Enable CORS

app.use(express.static(__dirname + '/public'));

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: 'aniketalok',       // Replace with your PostgreSQL username
    host: 'localhost',           // Replace with your PostgreSQL host
    database: 'currency_converter_db',   // Replace with your PostgreSQL database name
    password: 'root',   // Replace with your PostgreSQL password
    port: 5432,                  // Default PostgreSQL port
});

app.get('/convert', async (req, res) => {
    const sourceCurrency = req.query.source;
    const targetCurrency = req.query.target;
    const amount = parseFloat(req.query.amount);

    // Mock exchange rates
    const exchangeRates = {
        INR: {
            USD: 0.014,
        },
        USD: {
            INR: 71.45,
        },
    };

    const rate = exchangeRates[sourceCurrency][targetCurrency];
    const convertedAmount = amount * rate;

    res.json({ convertedAmount });
});

// Log conversion endpoint
app.post('/logConversion', express.json(), async (req, res) => {
    const { sourceCurrency, sourceAmount, targetCurrency, convertedAmount } = req.body;

    try {
        const query = 'INSERT INTO conversion_logs (date, source_currency, source_amount, target_currency, converted_amount) VALUES (NOW(), $1, $2, $3, $4)';
        await pool.query(query, [sourceCurrency, sourceAmount, targetCurrency, convertedAmount]);
        res.status(201).json({ message: 'Conversion logged successfully' });
    } catch (error) {
        console.error('Error logging conversion:', error);
        res.status(500).json({ message: 'An error occurred while logging the conversion' });
    }
});

// Fetch conversion history endpoint
app.get('/getHistory', async (req, res) => {
    try {
        const query = 'SELECT * FROM conversion_logs ORDER BY date DESC';
        const result = await pool.query(query);
        const conversionLogs = result.rows;
        res.json(conversionLogs);
    } catch (error) {
        console.error('Error fetching conversion history:', error);
        res.status(500).json({ message: 'An error occurred while fetching conversion history' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

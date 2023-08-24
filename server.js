const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS

app.use(express.static(__dirname + '/public'));

app.get('/convert', (req, res) => {
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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('conversion-form');
    const resultElement = document.getElementById('result');
    const resetButton = document.getElementById('reset-button');
    const historyButton = document.getElementById('history-button');
    const historyTableBody = document.getElementById('history-table-body');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const sourceCurrency = document.getElementById('source-currency').value;
        const targetCurrency = document.getElementById('target-currency').value;
        const amount = parseFloat(document.getElementById('amount').value);

        const response = await fetch(`/convert?source=${sourceCurrency}&target=${targetCurrency}&amount=${amount}`);
        const data = await response.json();

        resultElement.innerHTML = `Converted Amount: ${data.convertedAmount.toFixed(2)} ${targetCurrency}`;

        // After successful conversion, log the conversion
        logConversion(sourceCurrency, amount, targetCurrency, data.convertedAmount);
    });

    historyButton.addEventListener('click', () => {
        fetchConversionHistory();
    });

    resetButton.addEventListener('click', () => {
        resetForm();
    });

    function resetForm() {
        form.reset(); // Clear form fields
        resultElement.innerHTML = ''; // Clear the result display
    }

    async function logConversion(sourceCurrency, sourceAmount, targetCurrency, convertedAmount) {
        const conversionData = {
            sourceCurrency,
            sourceAmount,
            targetCurrency,
            convertedAmount,
        };

        await fetch('/logConversion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversionData),
        });
    }

    async function fetchConversionHistory() {
        const response = await fetch('/getHistory');
        const historyData = await response.json();

        // Clear previous history
        historyTableBody.innerHTML = '';

        // Display conversion history in the table
        historyData.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.date}</td>
                <td>${log.source_currency}</td>
                <td>${log.source_amount}</td>
                <td>${log.target_currency}</td>
                <td>${log.converted_amount}</td>
            `;
            historyTableBody.appendChild(row);
        });
    }
});

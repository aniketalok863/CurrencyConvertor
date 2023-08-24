document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('conversion-form');
    const resultElement = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const sourceCurrency = document.getElementById('source-currency').value;
        const targetCurrency = document.getElementById('target-currency').value;
        const amount = parseFloat(document.getElementById('amount').value);

        const response = await fetch(`/convert?source=${sourceCurrency}&target=${targetCurrency}&amount=${amount}`);
        const data = await response.json();

        resultElement.innerHTML = `Converted Amount: ${data.convertedAmount.toFixed(2)} ${targetCurrency}`;
    });
});

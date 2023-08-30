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
    const saveBtn=document.getElementById('save-button');
    saveBtn.addEventListener('click',async(event)=>{
        const editResultElement=document.getElementById('edit-result');
        const editModal= document.getElementById('edit-modal');
        const editLogId= parseInt(editModal.getAttribute('data-edit-id'));
        const editSourceCurrency=document.getElementById('edit-source-currency').value;
        const editTargetCurrency=document.getElementById('edit-target-currency').value;
        const editSourceAmount=document.getElementById('edit-source-amount').value;
        const editResponse = await fetch(`/convert?source=${editSourceCurrency}&target=${editTargetCurrency}&amount=${editSourceAmount}`);
        const data = await editResponse.json();
        editResultElement.innerHTML = `Converted Amount: ${data.convertedAmount.toFixed(2)} ${editTargetCurrency}`;
        saveEditedData(editSourceCurrency,editSourceAmount,editTargetCurrency,data.convertedAmount,editLogId);
        setTimeout(() => {
            $('#edit-modal').modal('hide');
            fetchConversionHistory();
        }, 750);
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
    async function saveEditedData(editSourceCurrency,editSourceAmount,editTargetCurrency,convertedAmount,editLogId){
        const editedConversionData={
            editSourceCurrency,
            editSourceAmount,
            editTargetCurrency,
            convertedAmount,
            editLogId
        };
        await fetch('/updateLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedConversionData)
        });
    }
    var historyData;
    async function fetchConversionHistory() {
        const response = await fetch('/getHistory');
        historyData = await response.json();

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
                <td><button class="btn btn-warning edit-button" data-id="${log.id}">Edit</button></td>
            `;
            historyTableBody.appendChild(row);
        });
        
    }
    historyTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('edit-button')) {
            const logId =parseInt( event.target.getAttribute('data-id'));
            const logToEdit = historyData.find(log => log.id === logId);
    
            // Populate the modal fields with logToEdit data
            const editSourceCurrency = document.getElementById('edit-source-currency');
            const editTargetCurrency=document.getElementById('edit-target-currency');
            const editAmount=document.getElementById('edit-source-amount');
            // Set the selected option based on logToEdit.source_currency
            editSourceCurrency.value = logToEdit.source_currency;
            editTargetCurrency.value=logToEdit.target_currency;
            editAmount.value=logToEdit.source_amount;
            const editModal = document.getElementById('edit-modal');
            editModal.setAttribute('data-edit-id', logId);
            // Show the edit modal using Bootstrap modal methods
            $('#edit-modal').modal('show');
        }
    });
    
    
});

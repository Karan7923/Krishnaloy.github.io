document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.has('edit');

    if (editMode) {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'admin' && password === 'admin@123') {
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('add-edit-section').style.display = 'block';
            } else {
                alert('Invalid username or password');
            }
        });
    }

   // loadEntries();
});
let entries = [];

document.getElementById('monthSelect').addEventListener('change', loadEntries);

async function loadEntries() {
    const month = document.getElementById('monthSelect').value;
    try {
        await initClient();
        const response = await fetchSheetData(month);
        processSheetData(response);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function initClient() {
    return Promise.resolve();
}

async function fetchSheetData(month) {
    const apiKey = 'AIzaSyDeSpMgtKcPFP4GIYDED20G3ZYrkvrX1RI';
    const spreadsheetId = '1jWAjncrYX6r9B1ytoilWdtw4ga5MxG8nKLDNIfd7vPU';
    const range = `${month}!A:G`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
}

function processSheetData(response) {
    const data = response.values;
    entries = [];
	let counter = 0;
    if (data && data.length > 0) {
        data.forEach(row => {
			if (counter++ == 0) return;
            if (row.length === 7) {
                const [Apartment_Number, Apartment_Area, Maintainence_Amount, Status, Owner, Recieved_date,Notes] = row;
				//Apartment_Number	Apartment_Area	Maintainence_Amount	Status	Owner	Due date
                entries.push({ Apartment_Number, Apartment_Area, Maintainence_Amount: parseFloat(Maintainence_Amount), Status, Owner, Recieved_date,Notes });
            }
        });
        updateEntryList();
        updateSummary();
    }
}

function updateEntryList() {
    const tbody = document.querySelector('#entriesTable tbody');
    tbody.innerHTML = '';
    entries.forEach(entry => {
        const tr = document.createElement('tr');
						//Apartment_Number	Apartment_Area	Maintainence_Amount	Status	Owner	Due date

        tr.innerHTML = `
            <td>${entry.Apartment_Number}</td>
            <td>${entry.Apartment_Area}</td>
            <td>${entry.Maintainence_Amount.toFixed(2)}</td>
            <td>${entry.Status}</td>
            <td>${entry.Owner}</td>
            <td>${entry.Recieved_date}</td>
            <td>${entry.Notes}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateSummary() {
    const summary = document.getElementById('summary');
    const total = entries.reduce((sum, entry) => sum + entry.Maintainence_Amount, 0);
    summary.innerHTML = `<p class="font-weight-bold">Total: ₹${total.toFixed(2)}</p>`;
}

// Load data for the initially selected month
window.onload = loadEntries;

document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'AIzaSyDeSpMgtKcPFP4GIYDED20G3ZYrkvrX1RI';
    const spreadsheetId = '1jWAjncrYX6r9B1ytoilWdtw4ga5MxG8nKLDNIfd7vPU';

    function updateEntries() {
        const month = document.getElementById('monthSelect').value;
        fetchEntries(month);
    }

    function fetchEntries(month) {
        const sheetName = month; // Assuming each month's data is in a separate sheet named after the month
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = '';

                const rows = data.values;
                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header row
                    const tr = document.createElement('tr');

                    tr.innerHTML = `
                        <td>${row[0]} (${row[1]}sqft)</td>
                        <td>${parseFloat(row[2]).toFixed(2)}</td>
                        <td class="${row[3].toLowerCase()}">${row[3]}</td>
                        <td>${row[4]}</td>
                        <td>${row[5]}</td>
                        <td>${row[6]}</td>
                    `;

                    if (row[3] === 'Received') {
                        tr.children[2].classList.add('status-received');
                    } else if (row[3] === 'Pending') {
                        tr.children[2].classList.add('status-pending');
                    } else if (row[3] === 'Overdue') {
                        tr.children[2].classList.add('status-overdue');
                    }

                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error fetching entries:', error));
    }

    updateEntries();

    document.getElementById('monthSelect').addEventListener('change', updateEntries);
});

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

                    // Safely access each row element and provide a fallback value if it's undefined or null
                    const apartmentNumber = row[0] || '';
                    const apartmentArea = row[1] || '';
                    const maintenanceAmount = row[2] ? parseFloat(row[2]).toFixed(2) : '';
                    const status = row[3] || '';
                    const owner = row[4] || '';
                    const receivedDate = row[5] || '';
                    const notes = row[6] || '';

                    let apartmentInfo = apartmentNumber;
                    if (apartmentArea) {
                        apartmentInfo += ` (${apartmentArea}sqft)`;
                    }

                    tr.innerHTML = `
                        <td>${apartmentInfo}</td>
                        <td>${maintenanceAmount}</td>
                        <td class="${status.toLowerCase()}">${status}</td>
                        <td>${owner}</td>
                        <td>${receivedDate}</td>
                        <td>${notes}</td>
                    `;

                    if (status === 'Received') {
                        tr.children[2].classList.add('status-received');
                    } else if (status === 'Pending') {
                        tr.children[2].classList.add('status-pending');
                    } else if (status === 'Overdue') {
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

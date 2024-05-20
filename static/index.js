document.addEventListener("DOMContentLoaded", function() {
    const statusTableBody = document.getElementById('statusTableBody');
    const subdomainInput = document.getElementById('subdomainInput');
    const addSubdomainButton = document.getElementById('addSubdomainButton');
    const feedbackMessage = document.getElementById('feedbackMessage');
 
    function fetchStatuses() {
        fetch('/status')
            .then(response => response.json())
            .then(data => {
                statusTableBody.innerHTML = '';
                for (const [subdomain, status] of Object.entries(data)) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-4 px-6 border-b">${subdomain}</td>
                        <td class="py-4 px-6 border-b">${status}</td>
                    `;
                    statusTableBody.appendChild(row);
                }
            });
    }
 
    function addSubdomain() {
        const subdomain = subdomainInput.value.trim();
        if (subdomain) {
            fetch('/add_subdomain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subdomain: subdomain })
            }).then(response => {
                if (response.ok) {
                    subdomainInput.value = '';
                    feedbackMessage.textContent = 'Subdomain added successfully!';
                    feedbackMessage.className = 'text-green-500';
                    fetchStatuses();
                } else {
                    feedbackMessage.textContent = 'Failed to add subdomain.';
                    feedbackMessage.className = 'text-red-500';
                }
            }).catch(() => {
                feedbackMessage.textContent = 'Error occurred while adding subdomain.';
                feedbackMessage.className = 'text-red-500';
            });
        } else {
            feedbackMessage.textContent = 'Please enter a valid subdomain.';
            feedbackMessage.className = 'text-red-500';
        }
    }
 
    addSubdomainButton.addEventListener('click', addSubdomain);
    setInterval(fetchStatuses, 5000);
    fetchStatuses();
});
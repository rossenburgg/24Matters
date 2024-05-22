document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.nav-tabs .nav-link');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            const type = this.getAttribute('data-history-type');
            fetchBetHistory(type);
            // Mark the clicked tab as active
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function fetchBetHistory(type) {
        fetch(`/game/bet-history?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('betHistoryTable').querySelector('tbody');
            tableBody.innerHTML = ''; // Clear current rows
            data.bets.forEach(bet => {
                const row = `<tr>
                    <td>${bet._id}</td>
                    <td>${bet.userId}</td>
                    <td>${new Date(bet.createdAt).toLocaleString()}</td>
                    <td>${bet.betAmount}</td>
                    <td>${bet.multiplier}</td>
                    <td>${bet.resultNumber}</td>
                    <td>${bet.payoutAmount}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching bet history:', error);
            alert('Error fetching bet history. Please try again.');
        });
    }

    // Initial fetch for 'My Bets' on page load
    fetchBetHistory('myBets');
});
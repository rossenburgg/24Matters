document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/analytics/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const ctx = document.getElementById('earningsChart').getContext('2d');
            const earningsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Earnings',
                        data: data.earnings,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            const taskMetricsTable = document.getElementById('taskMetrics');
            data.tasks.forEach(task => {
                const row = `<tr>
                                <td>${task.description}</td>
                                <td>${task.amountEarned}</td>
                                <td>${task.commission}</td>
                                <td>${task.status}</td>
                             </tr>`;
                taskMetricsTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching analytics data:', error);
        });
});
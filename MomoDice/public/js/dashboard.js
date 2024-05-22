async function fetchGameHistory() {
    try {
        const response = await fetch('/game/history');
        if (!response.ok) {
            console.error('Failed to fetch game history, response status:', response.status);
            throw new Error('Failed to fetch game history');
        }
        const data = await response.json();
        if (!data.games || !Array.isArray(data.games)) {
            console.error('Fetched game history is not an array:', data);
            throw new Error('Game history format is incorrect');
        }
        const games = data.games;
        const historyElement = document.getElementById('gameHistory');
        historyElement.innerHTML = '<h3>Recent Games</h3>';
        games.forEach(game => {
            const div = document.createElement('div');
            div.innerHTML = `Bet: ${game.betAmount}, Chosen Number: ${game.chosenNumber}, Result: ${game.diceResult}, Win: ${game.winStatus}`;
            historyElement.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching game history:', error.message, error.stack);
        document.getElementById('gameHistory').innerText = 'Error loading game history. Please try again later.';
    }
}

fetchGameHistory();
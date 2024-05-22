document.addEventListener('DOMContentLoaded', function() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}`);
    ws.onopen = function() {
        console.log("WebSocket connection established.");
    };
    ws.onerror = function(event) {
        console.error("WebSocket error observed:", event);
    };
    ws.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            if (message.type === 'betResult') {
                updateLiveStats(message.data);
            }
        } catch (error) {
            console.error("Error parsing message from WebSocket:", error.message, error.stack);
        }
    };

    function updateLiveStats(data) {
        try {
            // Update wagered amount
            const wageredElement = document.getElementById('wagered');
            let currentWagered = parseFloat(wageredElement.textContent);
            currentWagered += data.betAmount;
            wageredElement.textContent = currentWagered.toFixed(2);

            // Update profit
            const profitElement = document.getElementById('profit');
            let currentProfit = parseFloat(profitElement.textContent);
            if (data.won) {
                currentProfit += (data.payout - data.betAmount);
            } else {
                currentProfit -= data.betAmount;
            }
            profitElement.textContent = currentProfit.toFixed(2);

            // Update wins and losses
            const winsElement = document.getElementById('wins');
            const lossesElement = document.getElementById('losses');
            let currentWins = parseInt(winsElement.textContent);
            let currentLosses = parseInt(lossesElement.textContent);
            if (data.won) {
                currentWins += 1;
                winsElement.textContent = currentWins;
            } else {
                currentLosses += 1;
                lossesElement.textContent = currentLosses;
            }
        } catch (error) {
            console.error("Error updating live stats:", error.message, error.stack);
        }
    }
});
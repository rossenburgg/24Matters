document.addEventListener('DOMContentLoaded', function() {
    const betAmountInput = document.getElementById('betAmount');
    const halfBetButton = document.getElementById('halfBet');
    const doubleBetButton = document.getElementById('doubleBet');

    if (!betAmountInput || !halfBetButton || !doubleBetButton) {
        console.error('One or more essential elements are missing from the betting interface.');
        return;
    }

    function adjustBetAmount(action) {
        let betAmount = parseFloat(betAmountInput.value);
        if (!isNaN(betAmount)) {
            if (action === 'half') {
                betAmount /= 2;
            } else if (action === 'double') {
                betAmount *= 2;
            }
            betAmountInput.value = betAmount.toFixed(2);
            console.log(`Bet amount set to ${action}:`, betAmountInput.value);
        } else {
            console.error('Bet amount is not a valid number.');
        }
    }

    halfBetButton.addEventListener('click', function() {
        try {
            adjustBetAmount('half');
            console.log('Half bet button clicked.');
        } catch (error) {
            console.error('Error setting bet amount to half:', error.message, error.stack);
        }
    });

    doubleBetButton.addEventListener('click', function() {
        try {
            adjustBetAmount('double');
            console.log('Double bet button clicked.');
        } catch (error) {
            console.error('Error setting bet amount to double:', error.message, error.stack);
        }
    });
});
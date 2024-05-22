document.addEventListener('DOMContentLoaded', function() {
    const betAmountInput = document.getElementById('betAmount');
    const halfBetButton = document.getElementById('halfBet');
    const doubleBetButton = document.getElementById('doubleBet');

    if (!betAmountInput || !halfBetButton || !doubleBetButton) {
        console.error('Critical form elements are missing, cannot set up bet amount actions.');
        return;
    }

    // This function has been refactored to remove duplicate logic and ensure it's the single source of truth for setting bet amounts.
    function setBetAmount(action) {
        let betAmount = parseFloat(betAmountInput.value);

        if (isNaN(betAmount)) {
            console.error('Bet amount is not a valid number.');
            return;
        }

        switch (action) {
            case 'half':
                betAmount /= 2;
                break;
            case 'double':
                betAmount *= 2;
                break;
            default:
                console.error('Invalid action for setting bet amount.');
                return;
        }

        betAmountInput.value = betAmount.toFixed(2);
        console.log(`Bet amount set to ${action}:`, betAmountInput.value);
    }

    halfBetButton.addEventListener('click', function() {
        try {
            setBetAmount('half');
            console.log('Half bet button clicked.');
        } catch (error) {
            console.error('Error setting bet amount to half:', error.message, error.stack);
        }
    });

    doubleBetButton.addEventListener('click', function() {
        try {
            setBetAmount('double');
            console.log('Double bet button clicked.');
        } catch (error) {
            console.error('Error setting bet amount to double:', error.message, error.stack);
        }
    });
});
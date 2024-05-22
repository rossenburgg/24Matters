document.getElementById('betForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const betAmountElement = document.getElementById('betAmount');
    const thresholdElement = document.getElementById('threshold'); // Corrected from rollOverTargetElement to thresholdElement
    const multiplierElement = document.getElementById('multiplier');
    const winChanceElement = document.getElementById('winChance');
    const predictionElement = document.querySelector('select[name="prediction"]'); // Changed to select for prediction selection
    const resultElement = document.getElementById('result');

    if (!betAmountElement || !thresholdElement || !multiplierElement || !winChanceElement || !predictionElement || !resultElement) {
        console.error('One or more form elements are missing.');
        resultElement.innerText = 'Error: One or more form elements are missing.';
        return;
    }

    const betAmount = betAmountElement.value;
    const threshold = thresholdElement.value; // Corrected from rollTarget to threshold
    const multiplier = parseFloat(multiplierElement.value); // Parse multiplier as float to ensure decimal values are correctly handled
    const winChance = winChanceElement.value;
    const prediction = predictionElement.value; // Retrieve the value of the selected prediction
    const submitBtn = document.getElementById('submitBtn');
    const uniqueRequestId = Date.now().toString(36) + Math.random().toString(36).substr(2); // Generate a unique identifier for each bet request

    // Validate multiplier to ensure it is a positive number before submitting
    if (isNaN(multiplier) || multiplier <= 0) {
        console.error('Multiplier must be a positive number.');
        resultElement.innerText = 'Error: Multiplier must be a positive number.';
        return;
    }

    // Check if the submit button is already disabled to prevent duplicate submissions
    if (submitBtn.disabled) {
        console.log('Submit button is already disabled, preventing duplicate submission.');
        return;
    }

    // Disable the submit button immediately after the form submission to prevent duplicate submissions
    submitBtn.disabled = true;

    let hasError = false;

    try {
        console.log(`Attempting to place a bet with amount: ${betAmount}, threshold: ${threshold}, multiplier: ${multiplier}, win chance: ${winChance}, prediction: ${prediction}, and request ID: ${uniqueRequestId}`);
        const response = await fetch('/game/new-bet', { // Updated endpoint to /new-bet
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ betAmount, threshold, multiplier, winChance, prediction, requestId: uniqueRequestId }), // Include the unique request ID and prediction in the bet request
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error: ${errorResponse.error || 'Network response was not ok'}. Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.diceResult !== undefined && result.payout !== undefined) {
            resultElement.innerHTML = `Result: ${result.won ? 'Win!' : 'Loss!'} Payout: ${result.payout}, Dice Result: ${result.diceResult}`;
        } else {
            resultElement.innerHTML = 'Error: Missing result data.';
        }
        console.log(`Bet placed successfully. Server response: ${result.message}`);
    } catch (error) {
        console.error('Error during fetch operation:', error);
        resultElement.innerText = error.message.includes('Duplicate bet detected') ? 'Duplicate bet detected. Please wait before placing the same bet again.' : 'Error processing your bet. Please try again.';
        hasError = true;
    } finally {
        // Re-enable the submit button after a delay to prevent rapid successive submissions
        setTimeout(() => {
            submitBtn.disabled = false;
            if (!hasError) {
                resultElement.innerText = '';
            }
        }, 5000); // Adjust the timeout to 5000ms (5 seconds) to better balance user experience and system protection
    }
});
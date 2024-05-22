const crypto = require('crypto');
const { broadcast } = require('../utils/webSocketServer'); // Ensure correct import of the broadcast function
const { calculateMultiplier } = require('../utils/multiplierCalc'); // Import the calculateMultiplier function

// Updated playGame function to use the new betting mechanism and multiplier
function playGame(betAmount, prediction, threshold, winChance) {
  try {
    // Calculate the multiplier based on the win chance
    const multiplier = calculateMultiplier(winChance);

    // Validate the multiplier to ensure it's a positive number
    if (typeof multiplier !== 'number' || multiplier <= 0) {
      throw new Error('Multiplier must be a positive number.');
    }

    const diceResult = rollDiceNew();
    const won = calculateWin(prediction, threshold, diceResult);
    const payout = calculatePayout(betAmount, multiplier, won);

    console.log(`Game played with betAmount: ${betAmount}, prediction: ${prediction}, threshold: ${threshold}, winChance: ${winChance}, diceResult: ${diceResult}, multiplier: ${multiplier}, won: ${won}, payout: ${payout}`);

    // Broadcasting the result to all connected WebSocket clients
    const broadcastData = {
      type: 'betResult',
      data: { diceResult, won, payout, prediction, threshold, winChance, multiplier, resultNumber: diceResult }
    };
    broadcast(broadcastData); // Using the broadcast function from the WebSocket server utility

    return {
      diceResult,
      won,
      payout,
      prediction,
      threshold,
      winChance,
      multiplier,
      resultNumber: diceResult // Added to include the resultNumber in the return object
    };
  } catch (error) {
    console.error(`Error in playGame function: ${error.message}`);
    console.error(error.stack);
    throw error; // Rethrow the error after logging
  }
}

// Function to simulate rolling a virtual dice with results ranging from 0 to 100
function rollDiceNew() {
  const randomValue = crypto.randomInt(0, 101); // 101 is exclusive
  console.log(`Dice rolled: ${randomValue}`);
  return randomValue;
}

/**
 * Calculates the payout for a bet.
 * 
 * @param {number} betAmount - The amount of the bet.
 * @param {number} multiplier - The multiplier to apply to the bet amount for payout calculation.
 * @param {boolean} won - Whether the bet was won or not.
 * @returns {number} - The calculated payout amount.
 */
function calculatePayout(betAmount, multiplier, won) {
  if (typeof betAmount !== 'number' || betAmount <= 0) {
    console.error('Invalid bet amount: must be a positive number.');
    throw new Error('Invalid bet amount: must be a positive number.');
  }

  if (typeof multiplier !== 'number' || multiplier <= 0) {
    console.error('Invalid multiplier: must be a positive number.');
    throw new Error('Invalid multiplier: must be a positive number.');
  }

  if (typeof won !== 'boolean') {
    console.error('Invalid won parameter: must be a boolean.');
    throw new Error('Invalid won parameter: must be a boolean.');
  }

  if (won) {
    return parseFloat((betAmount * multiplier).toFixed(2));
  } else {
    return 0;
  }
}

/**
 * Determines if the bet was won based on the prediction, threshold, and dice result.
 * 
 * @param {string} prediction - The user's prediction ('above' or 'below').
 * @param {number} threshold - The threshold for the dice roll.
 * @param {number} diceResult - The result of the dice roll.
 * @returns {boolean} - Whether the bet was won.
 */
function calculateWin(prediction, threshold, diceResult) {
  return (
    (prediction === 'above' && diceResult > threshold) ||
    (prediction === 'below' && diceResult < threshold)
  );
}

module.exports = { playGame, rollDiceNew, calculatePayout };
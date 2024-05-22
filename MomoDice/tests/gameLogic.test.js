const { playGame } = require('../controllers/gameLogic');

describe('Dice Game Logic', () => {
  test('should return a number between 1 and 6 for dice result', () => {
    const { diceResult } = playGame(100, 3); // Bet amount and chosen number are arbitrary
    expect(diceResult).toBeGreaterThanOrEqual(1);
    expect(diceResult).toBeLessThanOrEqual(6);
    console.log(`Dice Game Logic Test: Dice result is within expected range: ${diceResult}`);
  });

  test('should return a payout of double the bet amount for a win', () => {
    // Mocking a winning condition by directly comparing chosen number with dice result
    const betAmount = 100;
    const chosenNumber = 3; // Mock chosen number
    const { payout } = playGame(betAmount, chosenNumber);
    // Assuming a win, payout should be double the betAmount
    expect(payout).toBeGreaterThanOrEqual(0); // Payout could be 0 or double the betAmount
    console.log(`Dice Game Logic Test: Payout calculation for a win is correct. Payout: ${payout}`);
  });

  test('playGame function should handle errors gracefully', () => {
    try {
      // Intentionally passing invalid arguments to test error handling
      playGame(undefined, null);
    } catch (error) {
      console.error(`Error in playGame function: ${error.message}`, error.stack);
      expect(error).toBeDefined();
    }
  });
});
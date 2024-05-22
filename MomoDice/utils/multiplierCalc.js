/**
 * Calculates the betting multiplier based on the win chance.
 * 
 * @param {number} winChance - The chance of winning, expressed as a percentage between 0 and 99.
 * @returns {number} The calculated multiplier based on the given win chance.
 * @throws {Error} Throws an error if winChance is not within the expected range or if it's not a number.
 */
function calculateMultiplier(winChance) {
  if (typeof winChance !== 'number') {
    throw new Error('Win chance must be a number.');
  }
  if (winChance <= 0 || winChance >= 99) {
    throw new Error('Win chance must be between 0 and 99.');
  }
  const multiplier = 99 / winChance;
  console.log(`Calculated multiplier for win chance ${winChance}: ${multiplier}`);
  return multiplier;
}

module.exports = { calculateMultiplier };
const NodeCache = require('node-cache');
const betCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

function addBetIdentifier(identifier) {
  try {
    const success = betCache.set(identifier, true);
    console.log(`Bet identifier added: ${identifier}, success: ${success}`);
    return success;
  } catch (error) {
    console.error(`Error adding bet identifier to cache: ${error.message}`, error.stack);
    throw error;
  }
}

function checkBetIdentifierExists(identifier) {
  try {
    const exists = betCache.has(identifier);
    console.log(`Check if bet identifier exists: ${identifier}, exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`Error checking bet identifier in cache: ${error.message}`, error.stack);
    throw error;
  }
}

module.exports = {
  addBetIdentifier,
  checkBetIdentifierExists
};
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameLogic');
const Game = require('../models/Game');
const historyController = require('../controllers/historyController'); // Added for bet history feature
const { isAuthenticated } = require('./middleware/authMiddleware');
const { acquireLock, releaseLock, isLockPresent } = require('../utils/lockManager');
const NodeCache = require('node-cache');
const betRequestCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

router.post('/new-bet', isAuthenticated, async (req, res) => {
  const { betAmount, prediction, threshold, multiplier, requestId } = req.body;
  const lockKey = `user-${req.session.userId}-bet`;

  if (!requestId) {
    console.error("Error: Request ID is missing.");
    return res.status(400).json({ error: "Request ID is missing." });
  }

  if (betRequestCache.get(requestId)) {
    console.log(`Duplicate request detected for requestId: ${requestId}.`);
    return res.status(409).json({ error: "This bet request has already been processed." });
  }

  if (isLockPresent(lockKey)) {
    console.log(`A bet is already being processed for user ${req.session.userId}.`);
    return res.status(429).json({ error: "A bet is already being processed. Please wait." });
  }

  try {
    await acquireLock(lockKey, async () => {
      const recentBet = await Game.findOne({
        userId: req.session.userId
      }).sort({ createdAt: -1 });

      if (recentBet && new Date() - new Date(recentBet.createdAt).getTime() < 10000 && recentBet.betAmount === betAmount && recentBet.prediction === prediction && recentBet.threshold === threshold) {
        console.log(`Duplicate bet detected for user ${req.session.userId}. Bet not processed.`);
        throw new Error("Duplicate bet detected. Please wait before placing the same bet again.");
      }

      // Ensure multiplier is correctly interpreted as a floating-point number
      const parsedMultiplier = parseFloat(multiplier);
      if (isNaN(parsedMultiplier) || parsedMultiplier <= 0) {
        console.error("Invalid multiplier value. Multiplier must be a positive number.");
        return res.status(400).json({ error: "Invalid multiplier value. Multiplier must be a positive number." });
      }

      const gameResult = gameController.playGame(betAmount, prediction, threshold, parsedMultiplier);
      const game = new Game({
        userId: req.session.userId,
        betAmount,
        prediction,
        threshold,
        resultNumber: gameResult.diceResult,
        winStatus: gameResult.won,
        payoutAmount: gameResult.payout
      });
      await game.save();
      betRequestCache.set(requestId, true);
      res.status(200).json({ 
        diceResult: gameResult.diceResult, 
        won: gameResult.won, 
        payout: gameResult.payout, 
        prediction: gameResult.prediction, 
        threshold: gameResult.threshold, 
        resultNumber: gameResult.resultNumber, 
        message: "Bet placed successfully." 
      });
    });
  } catch (error) {
    console.error(`Error in POST /new-bet: ${error.message}`, error.stack);
    if (error.message.includes("Duplicate bet detected")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error placing bet." });
    }
  } finally {
    releaseLock(lockKey).then(() => {
      console.log(`Lock released for key: ${lockKey}`);
    }).catch((error) => {
      console.error(`Error releasing lock for key: ${lockKey}`, error.message, error.stack);
    });
  }
});

router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    console.log(`Retrieved game history for userId ${req.session.userId}`);
    res.status(200).json({ games });
  } catch (error) {
    console.error(`Error in GET /history: ${error.message}`, error.stack);
    res.status(500).json({ error: "Error retrieving game history." });
  }
});

// Endpoint for handling auto betting configurations and starting the auto betting process
router.post('/auto-bet', isAuthenticated, async (req, res) => {
  const { stopLimit, numberOfRolls } = req.body;
  // Validate the input
  if (!stopLimit || !numberOfRolls) {
    return res.status(400).json({ error: "Missing stop limit or number of rolls." });
  }
  try {
    // Placeholder for starting the auto betting process
    // This should include logic to validate the user's balance, set up the auto betting according to the configurations,
    // and handle the betting logic in a loop or a scheduled task based on the number of rolls and stop limit.
    console.log(`Starting auto betting for user ${req.session.userId} with stop limit ${stopLimit} and number of rolls ${numberOfRolls}`);
    // Simulate auto betting process (this should be replaced with actual logic)
    // Implement the actual auto betting logic here
    // For now, simulate a successful auto betting initiation
    res.status(200).json({ message: "Auto betting started.", stopLimit, numberOfRolls });
  } catch (error) {
    console.error(`Error in POST /auto-bet: ${error.message}`, error.stack);
    res.status(500).json({ error: "Error starting auto betting." });
  }
});

// Route for fetching bet history
router.get('/bet-history', isAuthenticated, historyController.fetchBetHistory);

module.exports = router;
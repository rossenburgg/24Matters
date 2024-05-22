const Game = require('../models/Game');

exports.fetchBetHistory = async (req, res) => {
    try {
        const { type } = req.query; // "myBets", "allBets", "highRollers", "races"
        let query = {};

        switch (type) {
            case 'myBets':
                query.userId = req.session.userId;
                break;
            case 'highRollers':
                // Example condition, adjust based on actual logic
                query.betAmount = { $gte: 1000 }; // High rollers, based on bet amount. Adjust as needed.
                break;
            case 'races':
                // Example condition, adjust based on actual logic for races
                break;
            // Note: 'allBets' does not alter the query, fetching all records
        }

        const bets = await Game
            .find(query)
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 bets, adjust as needed

        console.log(`Bet history fetched successfully for type: ${type}`);
        res.json({ success: true, bets });
    } catch (error) {
        console.error('Error fetching bet history:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Error fetching bet history' });
    }
};
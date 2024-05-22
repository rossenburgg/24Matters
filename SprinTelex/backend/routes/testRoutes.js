const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.status(200).json({ message: 'Backend is running' });
});

router.use((err, req, res, next) => {
  console.error('Error encountered in testRoutes:', err.stack);
  res.status(500).send('An error occurred!');
});

module.exports = router;
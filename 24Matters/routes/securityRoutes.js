const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

router.post('/api/enable-2fa', isAuthenticated, async (req, res) => {
  const { userId } = req.session;
  try {
    const user = await User.findById(userId);
    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).send('Failed to generate QR code');
      }
      res.json({
        message: '2FA is enabled',
        dataURL: data_url,
        secret: secret.base32
      });
    });
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).send('Error enabling 2FA');
  }
});

router.post('/api/verify-2fa', isAuthenticated, async (req, res) => {
  const { userId } = req.session;
  const { token } = req.body;
  try {
    const user = await User.findById(userId);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      user.isTwoFactorEnabled = true;
      await user.save();
      res.json({ message: '2FA is verified and enabled' });
    } else {
      res.status(400).json({ message: 'Invalid token, verification failed' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    res.status(500).send('Error verifying 2FA');
  }
});

module.exports = router;
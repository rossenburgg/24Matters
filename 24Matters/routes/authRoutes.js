const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.redirect('/auth/setup2fa'); // Redirect to 2FA setup instead of login
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (user.twoFactorSecret) {
        req.session.tempUserId = user._id; // Store user ID temporarily
        res.redirect('/auth/2fa');
      } else {
        req.session.userId = user._id;
        res.redirect('/');
      }
    } else {
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/setup2fa', async (req, res) => {
  if (!req.session.userId && !req.session.tempUserId) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findById(req.session.userId || req.session.tempUserId);
    if (user.twoFactorSecret) {
      res.render('setup2fa', { user, qrCodeUrl: null, twoFactorEnabled: true });
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });
      req.session.tempSecret = secret.base32; // Store the secret temporarily in the session
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: encodeURIComponent('24Matters:' + user.username),
        issuer: '24Matters',
        encoding: 'ascii'
      });
      qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
        if (err) {
          console.error('Error generating QR code:', err);
          console.error(err.stack);
          throw err;
        }
        res.render('setup2fa', { user, qrCodeUrl: dataUrl, twoFactorEnabled: false });
      });
    }
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA setup.');
  }
});

router.post('/auth/setup2fa/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.session.userId);
    const secret = req.session.tempSecret; // Use the secret stored in the session
    console.log(`Verifying 2FA token: ${token} with secret: ${secret} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      user.twoFactorSecret = secret;
      await user.save();
      delete req.session.tempSecret; // Clear the temporary secret from the session
      res.redirect('/');
    } else {
      res.status(401).send('Invalid 2FA token');
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA verification.');
  }
});

router.get('/auth/2fa', (req, res) => {
  if (!req.session.tempUserId) {
    return res.redirect('/auth/login');
  }
  res.render('2fa');
});

router.post('/auth/2fa/verify', async (req, res) => {
  if (!req.session.tempUserId) {
    console.error('Unauthorized 2FA verification attempt without tempUserId in session.');
    return res.status(401).send('Unauthorized access.');
  }
  try {
    const { token } = req.body;
    const user = await User.findById(req.session.tempUserId); // Use tempUserId for verification
    console.log(`Verifying 2FA token: ${token} for user: ${user.username} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      req.session.userId = req.session.tempUserId; // Authenticate the user
      delete req.session.tempUserId; // Clear the temporary user ID
      res.redirect('/');
    } else {
      res.status(401).send('Invalid 2FA token');
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA verification.');
  }
});

router.post('/auth/disable2fa', async (req, res) => {
  if (!req.session.userId) {
    console.error('Unauthorized attempt to disable 2FA without being logged in.');
    return res.status(401).send('Unauthorized access.');
  }
  try {
    const { disableToken } = req.body;
    const user = await User.findById(req.session.userId);
    console.log(`Attempting to disable 2FA for user: ${user.username} with token: ${disableToken} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: disableToken,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      user.twoFactorSecret = undefined;
      await user.save();
      console.log(`2FA disabled for user: ${user.username}`);
      res.redirect('/auth/setup2fa');
    } else {
      console.error('Failed to disable 2FA: Invalid token');
      res.status(401).send('Invalid 2FA token');
    }
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred while disabling 2FA.');
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');
const isAdminMiddleware = require('./middleware/isAdminMiddleware');

// Admin Dashboard Route
router.get('/admin/dashboard', [isAuthenticated, isAdminMiddleware], (req, res) => {
    res.render('admin/dashboard');
});

// Route to display pending purchases for admin to review
router.get('/purchases', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const pendingPurchases = await Purchase.find({ status: 'pending' }).populate('itemId').exec();
    res.render('adminPurchases', { pendingPurchases });
  } catch (error) {
    console.error('Error fetching pending purchases:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to confirm a purchase
router.post('/purchase/:id/confirm', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).send('Purchase not found');
    }
    purchase.status = 'completed';
    await purchase.save();

    const user = await User.findById(purchase.userId);
    const item = await Item.findById(purchase.itemId);
    user.balance += item.commission;
    await user.save();

    console.log(`Purchase ${purchaseId} confirmed and commission added to user ${user._id}`);
    res.redirect('/admin/purchases');
  } catch (error) {
    console.error('Error confirming purchase:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to reject a purchase
router.post('/purchase/:id/reject', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).send('Purchase not found');
    }
    const user = await User.findById(purchase.userId);
    const item = await Item.findById(purchase.itemId);

    // Refund the user's balance
    user.balance += item.price;
    await user.save();

    // Optionally, set the item's status back to available
    item.status = 'available';
    await item.save();

    // Update purchase status to rejected
    purchase.status = 'rejected';
    await purchase.save();

    console.log(`Purchase ${purchaseId} rejected and user ${user._id} refunded`);
    res.redirect('/admin/purchases');
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
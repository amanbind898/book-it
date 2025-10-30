const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');

// GET /promo - Get all promo codes
router.get('/', async (req, res) => {
  try {
    const promos = await Promo.find().sort({ code: 1 });
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) {
      return res.json({ valid: false, message: 'Invalid or inactive promo code' });
    }

    res.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      message: `Promo code applied successfully`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


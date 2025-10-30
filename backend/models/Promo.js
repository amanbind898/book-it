const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

const Promo = mongoose.model('Promo', promoSchema);

module.exports = Promo;


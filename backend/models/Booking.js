const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  experienceTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  promoCode: { type: String },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


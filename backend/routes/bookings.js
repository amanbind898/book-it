const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

// GET /bookings - Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /bookings - Create a new booking
router.post('/', async (req, res) => {
  try {
    const {
      experienceId,
      userName,
      userEmail,
      userPhone,
      selectedDate,
      selectedTime,
      numberOfGuests,
      promoCode
    } = req.body;

    // Validate required fields
    if (!experienceId || !userName || !userEmail || !userPhone || !selectedDate || !selectedTime || !numberOfGuests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get experience details
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Check if slot is available
    const slot = experience.slots.find(
      s => s.date === selectedDate && s.time === selectedTime
    );

    if (!slot) {
      return res.status(400).json({ error: 'Slot not found' });
    }

    if (!slot.available) {
      return res.status(400).json({ error: 'Slot is not available' });
    }

    // Check for existing bookings on the same slot
    const existingBooking = await Booking.findOne({
      experienceId,
      selectedDate,
      selectedTime,
      bookingStatus: 'confirmed'
    });

    if (existingBooking) {
      // Mark slot as unavailable
      slot.available = false;
      await experience.save();
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Apply promo code if provided
    let discount = 0;
    if (promoCode) {
      const Promo = require('../models/Promo');
      const promo = await Promo.findOne({ code: promoCode.toUpperCase(), isActive: true });
      
      if (promo) {
        if (promo.discountType === 'percentage') {
          discount = Math.round((experience.price * numberOfGuests * promo.discountValue) / 100);
        } else {
          discount = Math.min(promo.discountValue, experience.price * numberOfGuests);
        }
      }
    }

    const totalAmount = (experience.price * numberOfGuests) - discount;

    // Create booking
    const booking = new Booking({
      experienceId,
      experienceTitle: experience.title,
      userName,
      userEmail,
      selectedDate,
      selectedTime,
      numberOfGuests,
      promoCode,
      discount,
      totalAmount
    });

    await booking.save();

    // Mark slot as unavailable
    slot.available = false;
    await experience.save();

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


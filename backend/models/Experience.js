const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  available: { type: Boolean, default: true },
  maxParticipants: { type: Number, default: 1 }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [String],
  location: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  slots: [slotSchema]
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;


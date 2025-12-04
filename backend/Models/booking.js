const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString() // Auto-generate if not provided
  },
  customerName: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date, 
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  cuisinePreference: {
    type: String,
    default: 'Any'
  },
  specialRequests: {
    type: String,
    default: 'None'
  },
  weatherInfo: {
    type: Object, // Added weatherInfo
    default: {}
  },
  seatingPreference: {
    type: String,
    enum: ['Indoor', 'Outdoor', 'Any'],
    default: 'Any'
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

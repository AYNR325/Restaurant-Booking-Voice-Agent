const { createNewBooking,
    getAllBookings,
    getBookingById,
    cancelBooking } = require('../Controllers/booking-controller');
const express = require('express');
const router = express.Router();

// Create a new booking
router.post('/', createNewBooking);

// Get all bookings
router.get('/', getAllBookings);

// Get a specific booking by ID
router.get('/:id', getBookingById);

// Cancel a booking by ID
router.delete('/:id', cancelBooking);

module.exports = router;
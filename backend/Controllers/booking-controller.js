const Booking = require('../Models/booking');

//create new booking
async function createNewBooking(req, res) {
    try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//get all bookings
async function getAllBookings(req, res) {
    try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get specific booking
async function getBookingById(req, res) {
    try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//cancel booking
async function cancelBooking(req,res) {
    try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    createNewBooking,
    getAllBookings,
    getBookingById,
    cancelBooking
}
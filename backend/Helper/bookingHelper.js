const Booking = require('../Models/booking');

//create booking
async function createBooking(bookingData) {
  try {
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    return JSON.stringify({ success: true, bookingId: newBooking._id });
  } catch (error) {
    return JSON.stringify({ success: false, error: error.message });
  }
}

//cancel booking
async function cancelBooking(customerName) {
  try {
    // Find the most recent confirmed booking for this customer
    const booking = await Booking.findOne({ 
      customerName: { $regex: new RegExp(customerName, 'i') }, // Case insensitive
      status: 'Confirmed' 
    }).sort({ bookingDate: -1 });

    if (!booking) {
      return JSON.stringify({ success: false, message: "No confirmed booking found for " + customerName });
    }

    booking.status = 'Cancelled';
    await booking.save();
    return JSON.stringify({ success: true, message: "Booking cancelled for " + customerName });
  } catch (error) {
    return JSON.stringify({ success: false, error: error.message });
  }
}

module.exports = { createBooking, cancelBooking };
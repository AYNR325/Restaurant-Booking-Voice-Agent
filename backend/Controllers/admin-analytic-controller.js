const Booking = require('../Models/booking');

//analytic endpoint for admin to get all details about bookings like total bookings, popular cuisine, peak hour, etc.

async function getAnalytics(req, res) {
    try {
    const bookings = await Booking.find();
    
    // Calculate Popular Cuisines
    const cuisineCounts = {};
    bookings.forEach(b => {
      const cuisine = b.cuisinePreference || 'Unknown';
      cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
    });
    
    // Calculate Peak Hours
    const hourCounts = {};
    bookings.forEach(b => {
      if (b.bookingTime) {
        // Extract hour from bookingTime (assuming format "HH:MM") 
        const hour = b.bookingTime.split(':')[0]; 
        if (hour) {
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
      }
    });

    res.json({
      totalBookings: bookings.length,
      cuisineCounts,
      hourCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    getAnalytics
}
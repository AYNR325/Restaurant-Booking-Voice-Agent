import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Password');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, analyticsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`)
      ]);
      setBookings(bookingsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ['Booking ID', 'Customer Name', 'Guests', 'Date', 'Time', 'Cuisine', 'Status'];
    const rows = bookings.map(b => [
      b.bookingId,
      b.customerName,
      b.numberOfGuests,
      new Date(b.bookingDate).toLocaleDateString(),
      b.bookingTime,
      b.cuisinePreference,
      b.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-white">
        <div className="bg-stone-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-stone-700">
          <h2 className="text-3xl font-serif font-bold text-center mb-6 text-amber-500">Manager Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-stone-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-600 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-amber-900/20"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center font-serif text-xl">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-8 font-sans selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-amber-50">Restaurant Manager</h1>
            <p className="text-stone-400 mt-1">Overview of reservations and performance</p>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="bg-stone-800 hover:bg-stone-700 px-4 py-2 rounded-lg transition-colors border border-stone-700">
              Back to Home
            </Link>
            <button 
              onClick={downloadCSV}
              className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-amber-900/20 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-stone-800 p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
              <h3 className="text-stone-400 text-sm uppercase tracking-wider font-bold">Total Bookings</h3>
              <p className="text-4xl font-serif font-bold mt-2 text-white">{analytics.totalBookings}</p>
            </div>
            <div className="bg-stone-800 p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
              <h3 className="text-stone-400 text-sm uppercase tracking-wider font-bold">Top Cuisine</h3>
              <p className="text-2xl font-serif font-bold mt-2 text-white">
                {Object.entries(analytics.cuisineCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="bg-stone-800 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
              <h3 className="text-stone-400 text-sm uppercase tracking-wider font-bold">Peak Hour</h3>
              <p className="text-2xl font-serif font-bold mt-2 text-white">
                {Object.entries(analytics.hourCounts).sort((a,b) => b[1] - a[1])[0]?.[0] 
                  ? `${Object.entries(analytics.hourCounts).sort((a,b) => b[1] - a[1])[0][0]}:00` 
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-stone-800 rounded-xl shadow-xl overflow-hidden border border-stone-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-900 text-stone-400 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Cuisine</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-stone-700/50 transition-colors">
                    <td className="p-4 font-medium text-white">{booking.customerName}</td>
                    <td className="p-4 text-stone-300">{booking.numberOfGuests}</td>
                    <td className="p-4 text-stone-300">
                      {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                    </td>
                    <td className="p-4 text-stone-300">{booking.cuisinePreference}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        booking.status === 'Confirmed' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' :
                        booking.status === 'Cancelled' ? 'bg-red-900/50 text-red-400 border border-red-700' :
                        'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

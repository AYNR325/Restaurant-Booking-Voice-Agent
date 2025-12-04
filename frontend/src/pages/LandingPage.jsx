import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-white font-sans selection:bg-amber-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Restaurant Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-amber-50 mb-6 drop-shadow-lg">
            Savor the Moment, <br />
            <span className="text-amber-400 italic">Book in Seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-stone-200 leading-relaxed drop-shadow-md">
            Experience dining redefined. Our AI concierge handles your reservation with the elegance of fine dining and the speed of modern technology.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/agent"
              className="group relative inline-flex items-center justify-center rounded-full py-4 px-10 text-base font-bold bg-amber-600 text-white hover:bg-amber-500 transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.5)] hover:shadow-[0_0_30px_rgba(217,119,6,0.7)] transform hover:-translate-y-1"
            >
              <span>Reserve a Table</span>
              <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              to="/admin"
              className="group inline-flex items-center justify-center rounded-full py-4 px-10 text-base font-bold border-2 border-stone-400 text-stone-200 hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              Manager Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-stone-900 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-amber-500 font-semibold tracking-wide uppercase text-sm">Premium Service</h2>
            <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
              Dining at your fingertips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80" 
                  alt="Gourmet Food" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-amber-100 mb-3">Smart Reservations</h3>
                <p className="text-stone-400 leading-relaxed">
                  Talk to our AI just like you would a concierge. It understands your cravings, dietary needs, and special occasions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1525610553991-2bede1a236e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Outdoor Seating" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-amber-100 mb-3">Weather Adaptive</h3>
                <p className="text-stone-400 leading-relaxed">
                  Planning an outdoor dinner? We check the forecast instantly and suggest the perfect table for the weather.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
                  alt="Restaurant Management" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-amber-100 mb-3">Seamless Management</h3>
                <p className="text-stone-400 leading-relaxed">
                  For restaurant managers, a powerful dashboard to track peak hours, popular dishes, and manage bookings effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

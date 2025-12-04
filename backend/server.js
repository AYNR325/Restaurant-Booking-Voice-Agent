const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Booking = require('./Models/booking');
const { getWeather } = require('./Helper/weatherHelper');
const { createBooking, cancelBooking } = require('./Helper/bookingHelper');
const bookingRoutes = require('./Routes/booking-routes');
const analyticRoutes = require('./Routes/analytic-routes');

const app = express()
const PORT = process.env.PORT || 5000;

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:5173';
// Middleware
app.use(cors({
  origin: CLIENT_BASE_URL
}));

app.use(express.json());

//MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// Tools Definition for Gemini
const tools = {
  get_weather: getWeather,
  create_booking: createBooking,
  cancel_booking: cancelBooking
};

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Construct chat history for Gemini
    // history from frontend: [{role: 'user', parts: '...'}, {role: 'model', parts: '...'}]
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
      systemInstruction: {
        role: "system",
        parts: [{text: `You are a helpful Restaurant Booking Voice Agent. 
        Today's date is ${new Date().toDateString()}.
        
        Your goal is to help users BOOK a table or CANCEL a booking.
        
        IF BOOKING:
        1. Customer Name (Ask for this first!)
        2. Number of guests
        3. Preferred date and time
        4. Cuisine preference (Italian, Chinese, Indian, etc.)
        5. Special requests (optional)
        
        IF CANCELLING:
        1. Ask for the Customer Name.
        2. Call 'cancel_booking' tool.
        
        Steps for Booking:
        1. Greet the user and ask for their name.
        2. Ask for missing details one by one or a few at a time.
        3. Once you have the DATE, call the 'get_weather' tool to check the weather.
        4. Based on the weather, suggest Indoor or Outdoor seating.
        5. Ask for any SPECIAL REQUESTS (e.g., allergies, anniversary, high chair). This is MANDATORY.
        6. Ask for confirmation of all details.
        7. Once confirmed, call the 'create_booking' tool with all details.
        8. Confirm to the user that the booking is made.
        
        Output JSON for tool calls if needed.
        Wait, I (the developer) am handling tool calls manually via text parsing for simplicity in this specific setup if function calling isn't strictly enforced, 
        BUT for this implementation, please output a SPECIAL JSON BLOCK if you want to call a tool:
        
        To call weather:
        { "tool": "get_weather", "date": "YYYY-MM-DD" }
        
        To create booking:
        { "tool": "create_booking", "data": { "customerName": "John Doe", "numberOfGuests": 2, "bookingDate": "YYYY-MM-DD", "bookingTime": "HH:MM", "cuisinePreference": "...", "specialRequests": "...", "seatingPreference": "...", "weatherInfo": {...} } }
        
        To cancel booking:
        { "tool": "cancel_booking", "customerName": "John Doe" }

        IMPORTANT: If you have fetched weather data, please include it in the 'weatherInfo' field of the booking data.
        
        If no tool call is needed, just respond with text.

        CRITICAL STYLE INSTRUCTION: You are a VOICE agent. 
        1. Do NOT use markdown formatting like asterisks (**), bullet points, or bold text. 
        2. Do NOT use lists. 
        3. Speak in full, natural sentences. 
        4. Instead of "* Number of guests: Two", say "You have two guests".
        5. Keep responses concise and conversational.
        `}]
      }
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Check for JSON tool call in response
    // This is a manual "tool use" loop implementation
    let finalResponse = responseText;
    
    // Try to parse JSON from the response (it might be wrapped in text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const toolCall = JSON.parse(jsonMatch[0]);
        
        if (toolCall.tool === 'get_weather') {
          const weatherData = await getWeather(toolCall.date);
          // Feed tool output back to model
          const toolResultMsg = `Weather tool result: ${weatherData}. Now suggest seating based on this.`;
          const followUp = await chat.sendMessage(toolResultMsg);
          finalResponse = followUp.response.text();
        } 
        else if (toolCall.tool === 'create_booking') {
          const bookingResult = await createBooking(toolCall.data);
          const toolResultMsg = `Booking tool result: ${bookingResult}. Now confirm to user.`;
          const followUp = await chat.sendMessage(toolResultMsg);
          finalResponse = followUp.response.text();
        }
        else if (toolCall.tool === 'cancel_booking') {
          console.log("Attempting to cancel booking for:", toolCall.customerName);
          const cancelResult = await cancelBooking(toolCall.customerName);
          console.log("Cancellation Result:", cancelResult);
          const toolResultMsg = `Cancellation tool result: ${cancelResult}. Now confirm to user.`;
          const followUp = await chat.sendMessage(toolResultMsg);
          finalResponse = followUp.response.text();
        }
      } catch (e) {
        console.log("JSON parse error or not a tool call:", e);
        // If parse fails, just return the text
      }
    }

    res.json({ response: finalResponse });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use Routes of booking and analytics
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', analyticRoutes);


app.get('/', (req, res) => {
  res.send('Restaurant Booking Voice Agent Backend is running.' )
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

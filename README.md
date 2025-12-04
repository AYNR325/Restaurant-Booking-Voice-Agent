# 🍽️ AI Restaurant Booking Voice Agent

A premium, voice-activated restaurant reservation system powered by **Google Gemini AI**. This full-stack application allows users to book tables using natural conversation, intelligently suggests seating based on real-time weather, and provides a robust admin dashboard for restaurant managers.

![Project Banner](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)

## ✨ Features

### 🗣️ Voice Agent (Client Side)
-   **Natural Conversation**: Talk to the AI just like a human concierge. It handles interruptions, corrections, and casual banter.
-   **Smart Context**: Remembers your name and details throughout the conversation.
-   **Weather Integration**: Automatically checks the forecast for your booking date and suggests **Indoor vs. Outdoor** seating.
-   **Chat Persistence**: Refresh the page without losing your conversation history.
-   **Voice Cancellation**: Cancel existing bookings simply by asking.

### 📊 Admin Dashboard (Manager Side)
-   **Secure Access**: Password-protected login for managers.
-   **Real-time Analytics**: View total bookings, popular cuisines, and peak hours.
-   **Booking Management**: View all reservations in a sortable, filterable list.
-   **Data Export**: Download booking data as CSV for external reporting.

### 🎨 Premium UI/UX
-   **Modern Design**: Dark-themed, elegant interface tailored for a high-end dining experience.
-   **Responsive**: Works seamlessly on desktop and tablet sizes.

---

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Web Speech API (Native Browser STT/TTS).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose).
-   **AI Model**: Google Gemini 2.5 Flash.
-   **External APIs**: OpenWeatherMap (Forecast).

---

## 🚀 Setup Instructions

Follow these steps to get the project running on your local machine.

### Prerequisites
-   **Node.js** (v14 or higher) installed.
-   **MongoDB** installed locally or a MongoDB Atlas connection string.
-   **API Keys**:
    -   Google Gemini API Key
    -   OpenWeatherMap API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Restaurant Booking Voice Agent"
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-booking
GEMINI_API_KEY=your_google_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

Start the backend server:

```bash
npm start
# OR for development with auto-reload
npm run dev
```
*Server will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies.

```bash
cd ../frontend
npm install
```

Start the React development server:

```bash
npm run dev
```
*Frontend will run on `http://localhost:5173`*

---

## 📖 Usage Guide

1.  **Open the App**: Go to `http://localhost:5173`.
2.  **Landing Page**: Click **"Reserve a Table"** to enter the Voice Agent.
3.  **Make a Booking**:
    -   Click the **Microphone** button.
    -   Say: *"I want to book a table for 2 people tomorrow at 7 PM."*
    -   The agent will ask for your name, check the weather, and confirm details.
4.  **Admin Dashboard**:
    -   Go back to Home and click **"Manager Login"**.
    -   Password: `admin123` (Default).
    -   View your new booking in the dashboard!

---

## 🧠 How It Works

1.  **Speech-to-Text**: The browser converts your voice into text.
2.  **AI Processing**: The text is sent to the backend, where **Google Gemini** processes the intent (Booking vs. Cancellation vs. Chit-chat).
3.  **Tool Calling**:
    -   If a date is mentioned, Gemini calls the `get_weather` tool.
    -   If all details are confirmed, Gemini calls the `create_booking` tool to save data to MongoDB.
4.  **Response**: The AI generates a natural text response.
5.  **Text-to-Speech**: The browser speaks the response back to you.

---



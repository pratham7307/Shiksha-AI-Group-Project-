# Shiksha AI – AI-Powered Personalized Digital Learning Platform

Shiksha AI is a comprehensive, production-ready digital learning platform inspired by the DIKSHA portal. It features advanced AI integration for personalized learning, instant doubt solving, and performance analytics.

## 🚀 Key Features
- **AI-Powered Chatbot**: Instant doubt resolution using Google Gemini API.
- **Smart Recommendations**: Course suggestions based on weak areas identified in tests.
- **Performance Analytics**: AI-driven feedback after every weekly test.
- **MVC Architecture**: Clean and scalable Node.js/Express backend.
- **Premium UI**: Modern React frontend with glassmorphism and smooth animations.
- **Full Auth System**: JWT-based secure authentication for Students and Teachers.

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, TypeScript, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **AI Integration**: Google Gemini API.
- **Styling**: Vanilla CSS with modern Design Tokens.

---

## 📂 Project Structure
```text
/client            # React Frontend
  /src
    /components    # Reusable UI components
    /context       # Auth state management
    /pages         # Main application pages
    /services      # API integration
/server            # Node.js Backend
  /config          # DB and system configs
  /controllers     # Business logic
  /models          # Mongoose schemas
  /routes          # API endpoints
  /services        # AI and external services
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.
- Google Gemini API Key.

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure `.env`:
   - Create a `.env` file in the `server` directory.
   - Add your `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
4. Seed the database: `node seed.js`
5. Start the server: `npm start` (or `node index.js`)

### 3. Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser.

---

## 🤖 AI Features Configuration
The system uses **Google Gemini 1.5 Flash** for:
1. **Chatbot**: Context-aware answers in the `CourseView` page.
2. **Analysis**: Analyzing test results to identify "Weak Topics".
3. **Recommendations**: Fetching courses that match identified weak topics.

---

## 📝 License
This project is for educational purposes. Built with ❤️ for the Shiksha AI project.

# 🎯 Resume Scanner AI — MERN + Telegram Bot

An AI-powered resume scanner that matches resumes against job descriptions, scores them out of 10, provides recommendations, and generates an optimized resume PDF. Features a Telegram bot integration.

---

## 🏗️ Tech Stack

- **Frontend**: React + Vite, Framer Motion, React Dropzone
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (optional — app works without it)
- **AI**: Anthropic Claude API
- **Bot**: Telegram Bot (node-telegram-bot-api)
- **PDF**: pdf-parse (read), pdfkit (generate)

---

## 📁 Project Structure

```
resume-scanner/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                  # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   ├── claudeAnalyzer.js
│   │   ├── pdfGenerator.js
│   │   ├── pdfParser.js
│   │   └── telegramBot.js
│   ├── uploads/             # Temp uploaded files (auto-created)
│   ├── outputs/             # Generated PDFs (auto-created)
│   └── index.js
└── package.json
```

---

## 🚀 Setup & Run in VS Code

### Step 1 — Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (optional) → https://www.mongodb.com/try/download/community
- **VS Code** → https://code.visualstudio.com

### Step 2 — Clone / Extract the Project

Extract the zip file to a folder, then open in VS Code:
```
File → Open Folder → Select resume-scanner folder
```

### Step 3 — Get Required API Keys

#### 🤖 Anthropic API Key (Required)
1. Go to https://console.anthropic.com
2. Sign up / Login
3. Go to **API Keys** → Create a new key
4. Copy the key (starts with `sk-ant-...`)

#### 📱 Telegram Bot Token (Optional but Recommended)
1. Open Telegram → Search **@BotFather**
2. Send `/newbot`
3. Enter a name (e.g., `My Resume Scanner`)
4. Enter a username (e.g., `myresumescanner_bot`)
5. Copy the token BotFather gives you

### Step 4 — Configure Environment

In VS Code terminal:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumescanner
GROQ_API_KEY=gsk_your_groq_key_here
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_TOKEN_HERE
CLIENT_URL=http://localhost:5173
```

> ⚠️ **MONGODB_URI** is optional. The app works without MongoDB — just leave the default value.
> 🔑 **GROQ_API_KEY** is required for AI analysis.

### Step 5 — Install Dependencies

Open VS Code terminal (`Ctrl + ~`) and run:

```bash
# From the root resume-scanner/ folder:
npm install

# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install

# Go back to root
cd ..
```

Or use the shortcut (from root folder):
```bash
npm run install:all
```

### Step 6 — Start the Application

```bash
# From the root resume-scanner/ folder:
npm run dev
```

This starts both:
- 🖥️ **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:5000

You should see:
```
[server] 🚀 Server running on http://localhost:5000
[server] 🤖 Telegram Bot polling started (if token is set)
[client] VITE ready in Xms → http://localhost:5173
```

### Step 7 — Open the App

Open your browser: **http://localhost:5173**

---

## 🤖 Telegram Bot Usage

Once your `TELEGRAM_BOT_TOKEN` is set and server is running:

1. Open Telegram → Search your bot by username
2. Send `/start`
3. Send `/scan`
4. Send the job description (text or PDF)
5. Send your resume PDF
6. Receive score + analysis + optimized resume PDF!

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Analyze resume vs job description |
| GET | `/api/health` | Health check |
| GET | `/outputs/:file` | Download generated PDF |

### POST /api/scan
Form data:
- `resume` (file, required) — Resume PDF
- `jobDescription` (file, optional) — JD as PDF/TXT
- `jobDescriptionText` (string, optional) — JD as plain text

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Make sure server is running: `cd server && npm run dev`
- Check port 5000 is free

### "PDF parse error"
- Ensure the resume is a real PDF (not scanned image)
- Try a different PDF

### "Claude API error"
- Double-check your `GROQ_API_KEY` in `.env`
- Make sure you have API credits at console.anthropic.com

### "Telegram bot not responding"
- Ensure `TELEGRAM_BOT_TOKEN` is set in `.env`
- Restart the server after adding the token
- Only one server should be running (polling conflicts)

### MongoDB connection warning
- This is safe to ignore — the app works without MongoDB
- Install MongoDB if you want to save scan history

---

## 📦 Build for Production

```bash
# Build React client
cd client && npm run build

# The build output is in client/dist/
# Serve it with any static host or configure Express to serve it
```

---

## 🎨 Features

- ✅ Drag & drop file uploads
- ✅ Paste or upload job description
- ✅ AI-powered ATS scoring (1–10)
- ✅ Score breakdown by category
- ✅ Matched & missing skills visualization
- ✅ Strengths & weaknesses analysis
- ✅ Actionable recommendations
- ✅ Downloadable optimized resume PDF
- ✅ Telegram bot integration
- ✅ Animated, dark-theme UI
- ✅ Mobile responsive

---

## 💡 Tips

- For best results, paste the **full** job description (not just the title)
- The AI works best with text-based PDFs (not scanned images)
- Scores below 5 trigger detailed recommendations automatically
- Generated PDFs are auto-deleted after 10 minutes for privacy

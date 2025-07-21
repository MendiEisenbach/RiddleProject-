# 🧠 RiddleProject

**RiddleProject** is a terminal-based trivia challenge game.  
Players solve riddles from various topics, with their solving time tracked and ranked.  
Riddles are stored in **MongoDB**, player data is managed via **Supabase**, and the game is built with a modular **client-server** architecture.

---

## 🚀 How It Works

1. User launches the game and enters their name.
2. The system checks Supabase for an existing player.
3. If not found, a new player is created.
4. Riddles are fetched from MongoDB.
5. Each riddle is presented one by one, and the player responds.
6. The time taken to solve each riddle is measured and recorded.
7. At the end:
   - The results are saved.
   - Player stats are displayed.
   - The leaderboard can be viewed.
8. The player can also create, update, or delete riddles via menu options.

---

## 🔁 Flowchart – Program Logic

```
START  
 ↓  
Display welcome message  
 ↓  
User inputs name  
 ↓  
Check Supabase:  
   → If exists → Load player  
   → Else → Create new player  
 ↓  
Fetch all riddles from MongoDB  
 ↓  
For each riddle:  
   → Start timer  
   → Display question  
   → Wait for user input  
   → Stop timer  
   → Record time  
 ↓  
After all riddles:  
   → Save results to Supabase  
   → Display stats and leaderboard  
   → Show options:  
       - Play again  
       - Manage riddles (CRUD)  
       - Exit  
 ↓  
END
```

---

## 📁 Project Structure

```
project-root/
├── .env
├── README.md
├── client/
│   ├── app.js                 ← User menu, interaction logic, fetch API calls
│   └── models/
│       ├── Riddle.js          ← Riddle class model
│       └── Player.js          ← Player class model
├── server/
│   ├── server.js              ← Express server setup, routes mounting
│   ├── routes/
│   │   ├── riddlesRouter.js   ← Riddle-related API routes
│   │   └── playersRouter.js   ← Player-related API routes
│   ├── riddles/
│   │   ├── riddleService.js   ← Riddle CRUD logic using MongoDB
│   │   └── mongoService.js    ← MongoDB connection handler
│   └── players/
│       ├── playersService.js      ← Supabase player logic
│       └── supabaseService.js     ← Supabase API client and DB access
└── package.json
```

---

## ✨ Features

- 🧩 Multiple riddles from different topics
- ⏱️ Response time tracking per riddle
- 👤 Player history and ranking via Supabase
- 🌐 MongoDB-based riddle storage with full CRUD
- 📊 Leaderboard of fastest players
- 🧱 Object-Oriented design (Player & Riddle classes)
- 🔁 Modular client-server architecture
- 🎮 Interactive CLI menu system
- 📡 RESTful API (Express.js backend)

---

## 🧪 Technologies

- Node.js
- Express.js
- MongoDB (via MongoDB Atlas)
- Supabase (PostgreSQL-based backend as a service)

---

## 👤 Author

**Menachem Eisenbach**  
Built as a hands-on learning project and code architecture exercise.

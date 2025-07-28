📘 README  
🧠 RiddleProject  
RiddleProject is a terminal-based trivia challenge game.  
Players solve riddles from various topics, with their solving time tracked and ranked.  
Riddles are stored in MongoDB, player data is managed via Supabase, and the game is built with a modular client-server architecture.

🚀 How It Works  
User launches the game and chooses how to log in:  
→ As a **Guest** or **Registered Player**.  
Based on the choice, the server authenticates the player and returns a **JWT token**.  
The token is saved locally and attached to every protected request.  
Riddles are fetched from MongoDB.  
Each riddle is presented one by one, and the player responds.  
The time taken to solve each riddle is measured and recorded.  

At the end:
- The results are saved.
- Player stats are displayed.
- The leaderboard can be viewed.
- Admins can create, update, or delete riddles via menu options.

🔁 Flowchart – Program Logic  
```
START  
 ↓  
Display welcome message  
 ↓  
User selects login option (Guest / Login / Register)  
 ↓  
If Login/Register → Authenticate with server  
 ↓  
Receive JWT token and role  
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
       - Manage riddles (CRUD) ← Admin only  
       - Exit  
 ↓  
END
```

🔐 Player Roles  
There are three kinds of players, each with different capabilities:

| Role   | Description                          | Permissions                                |
|--------|--------------------------------------|---------------------------------------------|
| 🧑‍🚀 Guest   | No registration required              | Can play riddles only                       |
| 👤 Player  | Registered user with JWT token     | Can play + track results in leaderboard     |
| 🛡️ Admin   | Has full privileges                 | Can also manage riddles (Create/Update/Delete) |

🛂 Authentication and JWT  
- When a player logs in or registers, the server responds with a **JWT token**.  
- This token is stored in memory during the session (`session.token`).  
- Every request to a protected endpoint includes an `Authorization: Bearer <token>` header.  
- On the server, a middleware (`requireAuth`) from `server/middleware/auth.js` verifies the token and extracts the user info.  
- Based on the `role` inside the token, permissions are enforced.  
- This middleware is used in the routers to protect specific endpoints.

🔒 Protected Endpoints  
These API routes require a valid JWT:

| Endpoint                          | Method | Role Required |
|-----------------------------------|--------|----------------|
| `/api/players/save-time`          | POST   | Player         |
| `/api/riddles` (POST / PUT / DELETE) | Various | Admin          |

⚙️ Environment Variables – `.env`  
Create a `.env` file in the project root and add the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_super_secret_key
PORT=4545
```

**Explanation:**
- `SUPABASE_URL` – Your Supabase project endpoint  
- `SUPABASE_KEY` – A service-level API key for DB access  
- `MONGO_URL` – MongoDB Atlas connection string for riddles DB  
- `JWT_SECRET` – Used to sign/verify JWT tokens  
- `PORT` – Server port (default: 4545)

📁 Project Structure  
```
project-root/
├── .env
├── README.md
├── client/
│   ├── app.js             ← Main entry point
│   ├── menu.js            ← Menus and CLI routing
│   ├── auth.js            ← Login, signup, session management
│   ├── game.js            ← Gameplay flow + leaderboard
│   ├── riddles.js         ← API logic (CRUD riddles)
│   └── classes/
│       ├── Player.js
│       └── Riddle.js
├── server/
│   ├── server.js              ← Express server setup, routes mounting
│   ├── routes/
│   │   ├── riddlesRouter.js   ← Riddle-related API routes (uses requireAuth)
│   │   └── playersRouter.js   ← Player-related API routes (uses requireAuth)
│   ├── riddles/
│   │   ├── riddleService.js   ← Riddle CRUD logic using MongoDB
│   │   └── mongoService.js    ← MongoDB connection handler
│   ├── players/
│   │   ├── playersService.js      ← Supabase player logic
│   │   └── supabaseService.js     ← Supabase API client and DB access
│   └── middleware/
│       └── auth.js            ← JWT authentication middleware (requireAuth)
└── package.json
```

✨ Features  
🧩 Multiple riddles from different topics  
⏱️ Response time tracking per riddle  
👤 Player history and ranking via Supabase  
🌐 MongoDB-based riddle storage with full CRUD  
📊 Leaderboard of fastest players  
🧱 Object-Oriented design (Player & Riddle classes)  
🔁 Modular client-server architecture  
🎮 Interactive CLI menu system  
📡 RESTful API (Express.js backend)  
🛡️ Role-based access control with JWT authentication  

🧪 Technologies  
Node.js  
Express.js  
MongoDB (via MongoDB Atlas)  
Supabase (PostgreSQL-based backend as a service)  
JWT for authentication  

👤 Author  
Menachem Eisenbach  
Built as a hands-on learning project and code architecture exercise.

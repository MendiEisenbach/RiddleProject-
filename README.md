# RiddleProject

RiddleProject is an interactive terminal-based trivia quiz game.  
Players are challenged with a series of riddles from various topics and must provide the correct answers.

---

## How It Works

- The user enters their name.  
- Riddles are loaded from a modular set of files.  
- The game presents each riddle and waits for an answer.  
- The time taken to answer is recorded.  
- At the end, player statistics are displayed.

---

## Flowchart – Program Logic

START  
↓  
Welcome message is displayed  
↓  
User enters their name  
↓  
Create new Player instance → Player(name)  
↓  
For each riddle in AllRiddles:  
→ Start timer → Date.now()  
→ Create new Riddle instance → Riddle(id, name, taskDescription, correctAnswer)  
→ Ask the riddle → Riddle.ask(prompt)  
→ End timer → Date.now()  
→ Record time taken → Player.recordTime(start, end)  
↓  
After all riddles answered:  
→ Show success message  
→ Show stats → Player.showStats()  
↓  
END

---

## Project Structure

```plaintext
RiddleProject/
├── app.js               # Main game controller
├── classes/
│   ├── Player.js        # Manages player info, timing, and stats
│   └── Riddle.js        # Represents a single riddle and handles input/output
├── riddles/
│   ├── r1.js, r2.js...  # Individual riddle files
│   └── AllRiddles.js    # Aggregates all riddles into a single export
├── README.md            # Project description



## Features

Multiple riddles from different topics

Response time tracking

Object-Oriented structure

Modular and extensible design


Author
Menachem Eisenbach
Created for learning and personal development.


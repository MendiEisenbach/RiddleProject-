import fs from 'fs';

const playersPath = "players/players.txt";

export const readPlayers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(playersPath, 'utf8', (err, data) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (Err) {
        reject(`error: ${Err}`);
      }
    });
  });
};

export const writePlayers = (players) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(playersPath, JSON.stringify(players), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};


export const findPlayerByName = (players, name) => {
  if (!Array.isArray(players)) return undefined;  
  const lowerName = name.toLowerCase();

  for (let i = 0; i < players.length; i++) {
    if (
      players[i].name && 
      typeof players[i].name === 'string' &&
      players[i].name.toLowerCase() === lowerName
    ) {
      return players[i];  
    }
  }
  return undefined;
};



export const savePlayerTime = async (name, time) => {
  try {
    const players = await readPlayers();
    let player = findPlayerByName(players, name);

    if (!player) {
      let maxId = 0;
      for (const p of players) {
        if (p.id > maxId) {
          maxId = p.id;
        }
      }

      const newPlayer = {
        id: maxId + 1,
        name : name,
        lowestTime: time
      };

      players.push(newPlayer);
      console.log(`New player added: ${name}`);

    } else {
      if (player.lowestTime === undefined || time < player.lowestTime) {
        console.log(`New record for ${name}! Old: ${player.lowestTime}, New: ${time}`);
        player.lowestTime = time;
      } else {
        console.log(`No new record. Your best is still ${player.lowestTime} seconds.`);
      }
    }

    await writePlayers(players);

  } catch (err) {
    console.error("error saving the time:", err);
    throw err; 
  }
};

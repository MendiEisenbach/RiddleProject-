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
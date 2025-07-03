import fs from 'fs';

const riddlesPath = "riddles/db.txt";

export const readFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(riddlesPath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });

}

export const writeFile = (riddles) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(riddlesPath, JSON.stringify(riddles), (err) => {
      if (err) reject(err);
      else resolve();
    })}
)
};


//  C/R/U

export const deleteRiddle = async (id) => {
  let riddles = await readRiddles();
  riddles = riddles.filter(r => r.id !== id);
  await writeRiddles(riddles);
}



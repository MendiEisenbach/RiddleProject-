import { supabase } from './supabaseService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET;

export const registerPlayer = async (username, password) => {
  const { data: existingUsers } = await supabase
    .from('Players')
    .select('name')
    .eq('name', username);

  if (existingUsers.length > 0) {
    throw new Error('Username already taken');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await supabase.from('Players').insert([
    {
      name: username,
      password_hash: passwordHash,
      role: 'user',
      lowestTime: null,
    },
  ]);

  if (error) throw new Error('Signup failed: ' + error.message);

  const token = jwt.sign({ name: username, role: 'user' }, SECRET, {
    expiresIn: '1h',
  });

  return { token,username, role: 'user' };
};


export async function loginPlayer(username, password) {
  const { data, error } = await supabase
    .from('Players')
    .select('*')
    .eq('name', username)
    .single();

  if (error || !data) throw new Error("User not found");

  const match = await bcrypt.compare(password, data.password_hash);
  if (!match) throw new Error("Wrong password");

  const token = jwt.sign(
    { name: data.name, role: data.role },
    SECRET,
    { expiresIn: '2h' }
  );

  return { token,username, role: data.role };
}


export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}


export const readPlayers = async () => {
  const { data, error } = await supabase
    .from('Players')
    .select('*');

  if (error) throw new Error(`Failed to fetch players: ${error.message}`);
  return data;
};


export const findPlayerByName = async (name) => {
  const { data, error } = await supabase
    .from('Players')
    .select('*')
    .ilike('name', name);

  if (error) throw new Error(`Failed to search player: ${error.message}`);
  return data;
};


export const savePlayerTime = async (name, time) => {
  try {
    const players = await findPlayerByName(name);

    if (players.length === 0) {
      throw new Error(`Player '${name}' not found`);
    }

    const player = players[0];

    if (player.lowestTime === null || time < player.lowestTime) {
      const { error } = await supabase
        .from('Players')
        .update({ lowestTime: time })
        .eq('id', player.id);

      if (error) throw error;

      console.log(`New record for ${name}! From ${player.lowestTime} to ${time}`);
    } else {
      console.log(`No new record for ${name}. Best remains: ${player.lowestTime} seconds.`);
    }

  } catch (err) {
    console.error("Error saving time:", err.message);
    throw err;
  }
};

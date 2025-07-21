import { supabase } from './supabaseService.js';

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
      const { error: insertError } = await supabase
        .from('Players')
        .insert([{ name, lowestTime: time }]);

      if (insertError) throw insertError;

      console.log(`New player added: ${name}`);
    } else {
      const existingPlayer = players[0];

      if (existingPlayer.lowestTime === null || time < existingPlayer.lowestTime) {
        const { error: updateError } = await supabase
          .from('Players')
          .update({ lowestTime: time })
          .eq('id', existingPlayer.id);

        if (updateError) throw updateError;

        console.log(`New record for ${name}! Old: ${existingPlayer.lowestTime}, New: ${time}`);
      } else {
        console.log(`No new record. Your best is still ${existingPlayer.lowestTime} seconds.`);
      }
    }

  } catch (err) {
    console.error("Error saving the time:", err);
    throw err;
  }
};



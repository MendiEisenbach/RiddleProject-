import promptSync from 'prompt-sync';
const prompt = promptSync();

export const session = {
  token: null,
  username: null,
  role: 'guest',
};

const serverUrl = 'https://riddleproject.onrender.com';

export async function signUp() {
  const name = prompt("Choose a username: ");
  const password = prompt("Choose a password: ");

  try {
    const res = await fetch(`${serverUrl}/api/players/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Signup failed:", data.error || data.msg);
      return;
    }

    session.token = data.token;
    session.username = name;
    session.role = data.role || 'user';

    console.log("Signed up successfully as", name);
  } catch (err) {
    console.error("Signup error:", err);
  }
}

export async function logIn() {
  const name = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  try {
    const res = await fetch(`${serverUrl}/api/players/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Login failed:", data.error || data.msg);
      return;
    }

    session.token = data.token;
    session.username = name;
    session.role = data.role || 'user';

    console.log("Logged in as", name);
  } catch (err) {
    console.error("Login error:", err);
  }
}

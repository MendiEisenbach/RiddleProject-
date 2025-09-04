import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) return res.status(403).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user; 
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: 'User not authenticated' });
    if (req.user.role !== role)
      return res.status(403).json({ error: 'Access denied: ' + role + ' only' });

    next();
  };
}
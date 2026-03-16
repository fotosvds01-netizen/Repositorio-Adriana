const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-simples';

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

const somenteAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.papel !== 'admin') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para administradores' });
  }

  next();
};

module.exports = {
  autenticar,
  somenteAdmin,
};


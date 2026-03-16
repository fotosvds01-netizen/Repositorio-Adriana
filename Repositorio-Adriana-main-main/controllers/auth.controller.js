const jwt = require('jsonwebtoken');
const db = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-simples';

const registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
  }

  const nomeFinal =
    nome && nome.trim().length > 0 ? nome.trim() : email.split('@')[0];

  try {
    const existente = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado' });
    }

    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel',
      [nomeFinal, email, senha, 'usuario']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
  }

  try {
    const result = await db.query(
      'SELECT id, nome, email, senha, papel FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

module.exports = {
  registrar,
  login,
};


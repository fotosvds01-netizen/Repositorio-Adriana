const db = require('../database/database');

const listarLivros = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM livros ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({ erro: 'Erro ao listar livros' });
  }
};

const buscarLivro = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM livros WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ erro: 'Erro ao buscar livro' });
  }
};

const criarLivro = async (req, res) => {
  const { titulo, autor, ano, genero } = req.body;

  if (!titulo || !autor || !ano || !genero) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await db.query(
      'INSERT INTO livros (titulo, autor, ano, genero) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, autor, ano, genero]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ erro: 'Erro ao criar livro' });
  }
};

const atualizarLivro = async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano, genero } = req.body;

  if (!titulo || !autor || !ano || !genero) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await db.query(
      'UPDATE livros SET titulo = $1, autor = $2, ano = $3, genero = $4 WHERE id = $5 RETURNING *',
      [titulo, autor, ano, genero, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ erro: 'Erro ao atualizar livro' });
  }
};

const deletarLivro = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM livros WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json({ mensagem: 'Livro removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).json({ erro: 'Erro ao deletar livro' });
  }
};

module.exports = {
  listarLivros,
  buscarLivro,
  criarLivro,
  atualizarLivro,
  deletarLivro,
};


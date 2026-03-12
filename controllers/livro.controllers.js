const db = require('../database/database');


// LISTAR TODOS
exports.listarLivro = (req, res) => {
  db.query("SELECT * FROM livro", (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(results);
  });
};


// BUSCAR POR ID
exports.buscarLivro = (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM livro WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    res.json(results[0]);
  });
};


// INSERIR
exports.criarLivro = (req, res) => {
  const { titulo, autor, ano, valor } = req.body;

  db.query(
    "INSERT INTO alunos (nome, idade, curso) VALUES (?, ?, ?) RETURNING id",
    [titulo, autor, ano, valor],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({
        mensagem: "Livro criado com sucesso!",
        id: result.insertId
      });
    }
  );
};


// ATUALIZAR
exports.atualizarLivro = (req, res) => {
  const id = req.params.id;
  const { titulo, autor, ano, valor } = req.body;

  db.query(
    "UPDATE alunos SET nome = ?, idade = ?, curso = ? WHERE id = ?",
    [titulo, autor, ano, valor, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
      }

      res.json({ mensagem: "Livro atualizado com sucesso!" });
    }
  );
};


// DELETAR
exports.deletarLivro = (req, res) => {
  const id = req.params.id;

  // Apenas administrador pode excluir
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ mensagem: 'Apenas o administrador pode excluir livros.' });
  }

  db.query("DELETE FROM alunos WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    res.json({ mensagem: "Livro deletado com sucesso!" });
  });
};
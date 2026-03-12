const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const livrosRoutes = require('./routes/livros.routes');

app.use('/api', livrosRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
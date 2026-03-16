require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const livrosRoutes = require('./routes/livros.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api', livrosRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;


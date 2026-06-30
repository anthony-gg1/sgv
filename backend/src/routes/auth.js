const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome?.trim() || !email?.trim() || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });
  }

  try {
    const [existente] = await pool.query(
      'SELECT id FROM empresa WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (existente.length) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const [resultado] = await pool.query(
      'INSERT INTO empresa (nome, email, senha) VALUES (?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), hash]
    );

    const empresa = {
      id: resultado.insertId,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
    };

    const token = jwt.sign(empresa, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ mensagem: 'Empresa cadastrada com sucesso.', token, empresa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar empresa.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email?.trim() || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, senha FROM empresa WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const empresaDb = rows[0];
    const senhaValida = await bcrypt.compare(senha, empresaDb.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const empresa = {
      id: empresaDb.id,
      nome: empresaDb.nome,
      email: empresaDb.email,
    };

    const token = jwt.sign(empresa, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ mensagem: 'Login realizado com sucesso.', token, empresa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao realizar login.' });
  }
});

router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, created_at FROM empresa WHERE id = ?',
      [req.empresa.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Empresa não encontrada.' });
    }

    res.json({ empresa: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar dados da empresa.' });
  }
});

module.exports = router;

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const vendasRoutes = require('./routes/vendas');
const relatoriosRoutes = require('./routes/relatorios');
const { seedIfNeeded } = require('./seed-on-start');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/relatorios', relatoriosRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', sistema: 'SGV' });
});

const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  const filePath = path.join(frontendPath, req.path === '/' ? 'index.html' : req.path);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
});

seedIfNeeded()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SGV rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Falha ao iniciar:', err.message);
    console.error('Verifique se o MySQL/MariaDB está ativo e o schema foi importado.');
    process.exit(1);
  });

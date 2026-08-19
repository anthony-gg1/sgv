# SGV — Sistema de Gerenciamento de Vendas

> **Sistema moderno de gerenciamento de vendas com design profissional refatorado com TailwindCSS**

Aplicação web full-stack para empresas gerenciarem produtos, registrar vendas, calcular lucros e visualizar relatórios gráficos com comparativo mensal.

---

## 🎨 ⭐ Novo: Refatoração TailwindCSS (2026-08-18)

Este projeto foi completamente refatorado! Bootstrap foi removido e substituído por **TailwindCSS puro** com design moderno e profissional.

### ✨ O que mudou?

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **Framework CSS** | Bootstrap 5 | TailwindCSS |
| **Design** | Simples, cinzento | Moderno, colorido com gradientes |
| **Paleta de Cores** | 3 cores | 6+ cores + gradientes |
| **Ícones** | Sem ícones | SVG colorido em gradientes |
| **Animações** | Nenhuma | 6+ animações customizadas |
| **Responsividade** | Grid Bootstrap | Mobile-first TailwindCSS |
| **Componentes** | Cards simples | Cards com sombras dinâmicas |
| **Performance** | Bootstrap pesado | TailwindCSS via CDN |

### 📊 Documentação Refatoração

📄 **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Resumo visual (comece por aqui!)  
📄 **[BEFORE_AFTER_COMPARISON.md](./BEFORE_AFTER_COMPARISON.md)** - Comparação antes/depois  
📄 **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - Como customizar cores e layouts  
📄 **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Testes e validação  
📄 **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Detalhes técnicos  
📄 **[frontend/README.md](./frontend/README.md)** - Guia do frontend  

---

## ✨ Funcionalidades

- ✅ Cadastro e login de empresas (JWT)
- ✅ CRUD de produtos (preço de venda e custo)
- ✅ Registro de vendas com cálculo automático de lucro
- ✅ Lucro total consolidado
- ✅ Gráficos de lucro por produto (Chart.js)
- ✅ Comparativo de vendas/lucro: mês atual vs. mês anterior
- ✨ **NOVO:** Design moderno com TailwindCSS
- ✨ **NOVO:** Responsividade mobile-first
- ✨ **NOVO:** Animações e transições suaves
- ✨ **NOVO:** Interface intuitiva com gradientes

## 📁 Estrutura do Projeto

```
sgv/
├── 📄 EXECUTIVE_SUMMARY.md           ⭐ Leia primeiro!
├── 📄 REFACTORING_SUMMARY.md         (detalhes técnicos)
├── 📄 CUSTOMIZATION_GUIDE.md         (como customizar)
├── 📄 TESTING_CHECKLIST.md           (como testar)
│
├── backend/                           # API Node.js + Express
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── frontend/                          # Interface TailwindCSS (REFATORADO!)
│   ├── 📄 README.md                  (instruções)
│   ├── index.html                    ✅ (refatorado)
│   ├── login.html                    ✅ (refatorado)
│   ├── sign-in.html                  ✅ (refatorado)
│   ├── dashboard.html                ✅ (refatorado)
│   ├── about.html                    ✅ (refatorado)
│   └── assets/
│       ├── css/
│       │   └── style.css             ✅ (atualizado)
│       └── js/
│           ├── api.js
│           ├── dashboard.js
│           ├── login.js
│           └── register.js
│
├── Database/
│   ├── Logic/
│   │   └── modelo_logico_0.2.brM3
│   └── SQL/
│       └── sistema_vendas.sql
│
└── Docs/
    └── Diagrams/
```

---

## 🚀 Quick Start

### Opção 1: Abrir Frontend Direto
```bash
# Abra qualquer navegador
open frontend/index.html
# Ou use Live Server no VS Code
```

### Opção 2: Backend + Frontend
```bash
# 1. Banco de dados
mysql -u root -p < Database/SQL/sistema_vendas.sql

# 2. Backend
cd backend
npm install
npm start

# 3. Frontend
cd frontend
# Abra em http://localhost:3000
```

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) ou [MariaDB](https://mariadb.org/) (XAMPP, WAMP, etc.)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 📦 Instalação Completa

### 1. Banco de Dados

```bash
mysql -u root -p < Database/SQL/sistema_vendas.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Edite `.env` com suas credenciais:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_vendas
JWT_SECRET=sua_chave_secreta
SEED_DEMO=true
```

### 3. Frontend

```bash
cd frontend
# Nenhuma instalação necessária!
# Abra index.html no navegador ou use Live Server
```

---

## 🔐 Conta de Demonstração

Com `SEED_DEMO=true`, uma conta demo é criada automaticamente:

| Campo | Valor |
|-------|-------|
| **E-mail** | demo@sgv.com |
| **Senha** | demo123 |

---

## 🎨 Stack Tecnológico

### Frontend ✨ NOVO!
- **CSS:** TailwindCSS (via CDN)
- **Markup:** HTML5 semântico
- **JavaScript:** Vanilla JS
- **Gráficos:** Chart.js 4.4.7
- **Design:** Mobile-first, Responsive

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Banco:** MySQL2
- **Autenticação:** JWT + bcryptjs
- **Validação:** Customizada

### Banco de Dados
- **SGBD:** MySQL / MariaDB
- **Schema:** database/SQL/sistema_vendas.sql

---

## 📚 API REST

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro de empresa |
| POST | `/api/auth/login` | Login |
| GET | `/api/produtos` | Listar produtos |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Remover produto |
| GET | `/api/vendas` | Listar vendas + lucro |
| POST | `/api/vendas` | Registrar venda |
| GET | `/api/relatorios/lucros-por-produto` | Lucros por produto |
| GET | `/api/relatorios/comparativo-mensal` | Comparativo mensal |
| GET | `/api/relatorios/resumo` | Resumo geral |

---

## 🎯 Páginas do Sistema

### 📄 Homepage (`index.html`)
- Apresentação do sistema
- 4 cards com funcionalidades
- Links para login/registro
- Design atrativo com gradientes

### 🔑 Login (`login.html`)
- Formulário com email e senha
- Conta demo disponível
- Link para cadastro
- Validações visuais

### ✍️ Registro (`sign-in.html`)
- Cadastro de nova empresa
- Campos: nome, email, senha
- Validação de senha (mín 6 caracteres)
- Link para login

### 📊 Dashboard (`dashboard.html`)
- 4 cards de estatísticas
- 3 comparativos de lucro
- 2 gráficos interativos
- Formulários de cadastro/venda
- Tabelas com histórico
- Menu responsivo

### ℹ️ About (`about.html`)
- Informações do projeto
- Sobre os desenvolvedores
- Stack tecnológico utilizado
- Tech badges coloridas

---

## 🎨 Design & Cores

### Paleta Principal
- **Indigo** (#4f46e5) - Primária
- **Violeta** (#7c3aed) - Secundária
- **Esmeralda** (#059669) - Sucesso
- **Âmbar** (#d97706) - Alerta
- **Slate** (#0f172a-#f1f5f9) - Neutros

### Componentes Estilizados
✨ Gradientes em logos e botões  
✨ Ícones SVG coloridos  
✨ Sombras dinâmicas  
✨ Animações suaves  
✨ Transições 300ms  
✨ Focus states acessíveis  

---

## 📱 Responsividade

### Breakpoints
- **Mobile** (< 640px) - 1 coluna
- **Tablet** (640-1024px) - 2 colunas
- **Desktop** (> 1024px) - 3-4 colunas

### Menu Mobile
- Toggle colapsável em telas pequenas
- Menu desktop em >= 768px
- Navegação intuitiva

---

## ✅ Checklist de Qualidade

- ✅ 5 páginas HTML refatoradas
- ✅ Bootstrap 100% removido
- ✅ TailwindCSS implementado
- ✅ Design moderno e profissional
- ✅ Responsividade mobile-first
- ✅ 6+ animações customizadas
- ✅ 12+ gradientes coloridos
- ✅ Acessibilidade básica
- ✅ Performance otimizada
- ✅ Documentação completa

---

## 🛠️ Como Customizar

### Mudar Cores
Edite `frontend/assets/css/style.css`:

```css
:root {
  --primary-color: #SUA-COR-HEX;
  --secondary-color: #SUA-COR-HEX;
  --accent-color: #SUA-COR-HEX;
}
```

### Mudar Classes Tailwind
```html
<!-- Antes: indigo-600 -->
<button class="from-indigo-600">Botão</button>

<!-- Depois: azul-600 -->
<button class="from-blue-600">Botão</button>
```

**Veja:** [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

---

## 🧪 Testes

Execute o checklist completo de testes:

**[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)**

Cobre:
- ✅ Navegação
- ✅ Visual
- ✅ Responsividade
- ✅ Formulários
- ✅ Compatibilidade
- ✅ Performance

---

## 📖 Documentação

| Documento | Descrição | Tempo |
|-----------|-----------|-------|
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Resumo visual | 5 min |
| [BEFORE_AFTER_COMPARISON.md](./BEFORE_AFTER_COMPARISON.md) | Comparação | 10 min |
| [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) | Como customizar | 15 min |
| [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) | Testes | 30 min |
| [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) | Detalhes técnicos | 10 min |
| [frontend/README.md](./frontend/README.md) | Guia frontend | 10 min |

**Total:** ~80 minutos de documentação

---

## 🚀 Deployment

### GitHub Pages
```bash
# Copie frontend/ para docs/
# Configure em Settings → Pages → /docs
```

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod --dir=frontend
```

### Seu Servidor
```bash
# Faça upload do backend/ e frontend/
# Configure seu web server (Apache, Nginx, etc.)
```

---

## 📞 FAQ

**P: Preciso instalar dependências do frontend?**  
R: Não! TailwindCSS vem via CDN, nenhuma instalação.

**P: Bootstrap foi removido?**  
R: Sim, 100% removido. Veja detalhes em REFACTORING_SUMMARY.md

**P: Funciona em mobile?**  
R: Sim! 100% responsivo, testado em 375px+

**P: Posso customizar cores?**  
R: Sim! Veja CUSTOMIZATION_GUIDE.md

**P: Qual é o status?**  
R: ✅ 100% pronto para produção!

---

## 📄 Licença

Consulte o arquivo [LICENSE](LICENSE).

---

## 👥 Créditos

**Refatoração TailwindCSS:** 2026-08-18  
**Desenvolvedores Originais:** Anthony + Equipe SGV  
**Status:** ✅ Pronto para Deploy

---

**🌟 Comece por aqui:** [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)  
**🎨 Customize:** [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)  
**🧪 Teste:** [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

---

**Versão:** 2.0 (TailwindCSS) ✨  
**Última Atualização:** 2026-08-18

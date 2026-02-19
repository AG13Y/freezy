# 🚀 FreeLancer - Sistema de Gestão para Profissionais Independentes

O **FreeLancer** é uma plataforma moderna e responsiva desenvolvida para auxiliar freelancers e equipes no gerenciamento completo de seu fluxo de trabalho.

O projeto simula um ecossistema real de gestão, incluindo desde o controle de projetos e documentos até a visualização de métricas em um dashboard dinâmico.

> ⚙️ Este projeto foi gerado com **Angular CLI versão 20.3.6**.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza o que há de mais recente no ecossistema de desenvolvimento web:

### 🎨 Frontend
- **Angular 20** (última versão)
  - Componentes standalone
  - Roteamento avançado

### 🎯 Estilização
- **Tailwind CSS 4**
- Integração com **SASS/SCSS**

### 🧩 UI Components
- **Angular Material**
  - Componentes acessíveis e consistentes

### 🔗 Backend (Simulação)
- **JSON Server**
  - Persistência de dados
  - Simulação de API RESTful

### 🔐 Segurança
- **Guards**
  - `authGuard`
  - `publicGuard`

### ⚙️ Utilitários
- **RxJS** (Programação Reativa)
- **clsx**
- **tailwind-merge**

---

## ✨ Funcionalidades Principais

A aplicação está estruturada para oferecer uma experiência completa de usuário:

- 🔑 **Autenticação**
  - Login
  - Registro de usuários
  - Rotas protegidas

- 📊 **Dashboard**
  - Visualização rápida do status do negócio

- 📁 **Gestão de Projetos**
  - Listagem
  - Controle detalhado de projetos ativos

- 📅 **Calendário**
  - Visualização de prazos
  - Agendamentos importantes

- 📂 **Gestão de Documentos**
  - Armazenamento
  - Organização de arquivos do projeto

- 👥 **Equipe e Colaboração**
  - Gestão de membros da equipe

- 📈 **Relatórios**
  - Métricas
  - Análises de desempenho

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

- Node.js instalado
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli
```

---

### 🔧 Passo a passo

#### 1️⃣ Clone o repositório

```bash
git clone [url-do-seu-repositorio]
cd free-lancer
```

#### 2️⃣ Instale as dependências

```bash
npm install
```

#### 3️⃣ Inicie o servidor de mock (API)

```bash
npm run json-server
```

Isso iniciará o banco de dados simulado localizado em:

```
db/db.json
```

#### 4️⃣ Inicie a aplicação Angular

```bash
ng serve
```

Acesse no navegador:

```
http://localhost:4200/
```

A aplicação recarregará automaticamente sempre que você modificar qualquer arquivo.

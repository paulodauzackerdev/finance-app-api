# Finance App API

API RESTful desenvolvida com Node.js, Express e PostgreSQL, focada em boas práticas de arquitetura backend, validações robustas e organização de código escalável.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- bcrypt
- validator
- ESLint
- Prettier
- Husky
- lint-staged

---

# 📁 Arquitetura

O projeto segue separação de responsabilidades em camadas:

```bash
src/
├── controllers/
├── use-cases/
├── repositories/
├── db/
├── routes/
├── errors/
```

## Camadas

### Controllers

Responsáveis por:

- receber requisições HTTP
- retornar respostas HTTP
- tratar erros específicos

### Use Cases

Responsáveis pelas regras de negócio:

- validações
- normalização de dados
- verificações de domínio
- hashing de senha

### Repositories

Responsáveis exclusivamente pelo acesso ao banco de dados.

---

# ✅ Funcionalidades

## Usuários

### Criar usuário

`POST /api/users`

### Buscar usuário por ID

`GET /api/users/:id`

### Buscar usuário por email

`GET /api/users/email/:email`

### Listar usuários

`GET /api/users`

### Atualizar usuário

`PATCH /api/users/:id`

### Deletar usuário

`DELETE /api/users/:id`

---

# 🔒 Validações implementadas

- UUID válido
- nome obrigatório
- sobrenome obrigatório
- email válido
- senha mínima
- email duplicado
- tipos primitivos corretos
- proteção contra deleção de usuário admin

---

# ⚠️ Tratamento de erros customizados

O projeto possui classes específicas de erro:

- `UserNotFoundError`
- `UserAlreadyExistsError`
- `InvalidNameError`
- `InvalidLastNameError`
- `InvalidEmailError`
- `WeakPasswordError`
- `InvalidUserIdError`
- `InvalidIsActiveError`
- `ForbiddenUserDeletionError`

---

# 🔐 Segurança

- Senhas são criptografadas com bcrypt
- Dados sensíveis não são retornados na API
- Validações de entrada em todos os endpoints

---

# 🧹 Padronização de código

O projeto utiliza:

- ESLint
- Prettier
- Husky
- lint-staged

Garantindo:

- padrão de código consistente
- commits mais seguros
- qualidade automática no pre-commit

---

# ▶️ Como rodar o projeto

## Instalar dependências

```bash
npm install
```

## Configurar variáveis ambiente

Crie um arquivo `.env`

```env
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

## Rodar projeto

```bash
npm run start:dev
```

---

# 📌 Objetivo

Este projeto faz parte da minha jornada de aprendizado como desenvolvedor backend JavaScript, com foco em:

- arquitetura limpa
- boas práticas
- APIs RESTful
- escalabilidade
- código consistente
- preparação para mercado backend júnior

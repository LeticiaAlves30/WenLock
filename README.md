# Wenlock

Wenlock é uma aplicação Full Stack para gerenciamento de usuários, organizada como monorepo. O projeto oferece uma SPA React para a operação do sistema e uma API NestJS com persistência em PostgreSQL.

## Stack

- Monorepo: pnpm workspaces e TypeScript
- Frontend: React, Vite, React Router, Tailwind CSS, Manrope, TanStack Query, React Hook Form, Zod, Vitest e React Testing Library
- Backend: NestJS, Prisma, PostgreSQL, class-validator, bcrypt, Swagger e Jest
- Ícones de interface: `@phosphor-icons/react`

## Estrutura

```text
.
├── apps/
│   ├── backend/                 # API NestJS e Prisma
│   │   ├── prisma/              # schema, migrations e seed
│   │   └── src/
│   │       ├── common/          # PrismaService
│   │       ├── config/          # configuração da aplicação
│   │       └── modules/         # health e users
│   └── frontend/                # SPA React/Vite
│       └── src/
│           ├── assets/          # logo e ilustrações do produto
│           ├── components/      # layout, UI, feedback e usuários
│           ├── pages/           # Login, Home e Usuários
│           ├── routes/          # roteamento e proteção local
│           └── services/        # cliente HTTP e serviços
├── packages/shared/             # contratos compartilháveis
├── docker-compose.yml           # PostgreSQL local
└── pnpm-workspace.yaml
```

## Pré-requisitos

- Node.js 22+ (testado com Node 24)
- pnpm 10+ (use `corepack enable` se necessário)
- Docker e Docker Compose, ou uma instância PostgreSQL local

## Configuração local

Instale as dependências e crie os arquivos de ambiente:

```bash
pnpm install
Copy-Item apps/frontend/.env.example apps/frontend/.env
Copy-Item apps/backend/.env.example apps/backend/.env
```

No macOS/Linux, substitua `Copy-Item` por `cp`.

Para utilizar o PostgreSQL via Docker:

```bash
docker compose up -d
pnpm --dir apps/backend exec prisma migrate deploy
pnpm --filter @wenlock/backend db:seed
```

Os exemplos de ambiente usam:

```env
# apps/backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wenlock?schema=public
PORT=3000
WEB_ORIGIN=http://localhost:5173

# apps/frontend/.env
VITE_API_URL=http://localhost:3000/api
```

## Seed administrativo

O seed é idempotente e cria ou atualiza o usuário administrativo abaixo:

| Campo | Valor |
| --- | --- |
| Nome | Administrador WenLock |
| E-mail | admin@wenlock.local |
| Matrícula | 000001 |
| Senha | Admin1 |

A senha atende à regra atual de seis caracteres alfanuméricos e é persistida somente como hash bcrypt. O modelo atual não possui um campo de papel/permissão; a identificação administrativa é dada pelos dados do seed.

## Execução

Inicie frontend e backend:

```bash
pnpm dev
```

Ou inicie cada aplicação separadamente:

```bash
pnpm dev:frontend
pnpm dev:backend
```

### URLs locais

- Web: http://localhost:5173
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Health check: http://localhost:3000/api/health
- PostgreSQL: localhost:5432

## Recursos entregues

- Layout global com sidebar, topbar e menu de perfil
- Home com ilustração de boas-vindas
- CRUD de usuários com busca server-side, debounce e paginação de 15 itens
- Cadastro e edição com validação Zod e React Hook Form
- Confirmação de cancelamento e exclusão
- Toasts de cadastro e exclusão bem-sucedidos
- Estado vazio e estado de pesquisa sem resultado com ilustrações
- Drawer lateral para visualização dos detalhes de um usuário
- API REST de usuários com validação, unicidade de e-mail/matrícula e senha hasheada

## Rotas do frontend

| Rota | Descrição |
| --- | --- |
| `/login` | Login demonstrativo, fora do layout interno |
| `/` | Home protegida por sessão local |
| `/users` | Listagem, busca, visualização e exclusão |
| `/users/new` | Cadastro de usuário |
| `/users/:id/edit` | Edição de usuário |

## API de usuários

Todos os endpoints usam o prefixo `/api`:

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/users` | Lista usuários paginados e aceita `page`, `limit` e `search` |
| `GET` | `/users/:id` | Busca um usuário por UUID |
| `POST` | `/users` | Cria um usuário |
| `PATCH` | `/users/:id` | Atualiza um usuário |
| `DELETE` | `/users/:id` | Exclui um usuário |

Consulte o Swagger local para os schemas completos e exemplos de requisição.

## Scripts

```bash
pnpm dev                                      # inicia frontend e backend
pnpm dev:frontend                             # inicia apenas o frontend
pnpm dev:backend                              # inicia apenas o backend
pnpm build                                    # compila todos os workspaces
pnpm lint                                     # executa o lint em todos os workspaces
pnpm test                                     # executa os testes em todos os workspaces
pnpm --filter @wenlock/backend db:seed        # executa o seed administrativo
pnpm format                                   # formata o repositório com Prettier
```

## Qualidade

Os testes cobrem validações, fluxos de cadastro, edição, exclusão, listagem, busca, navegação, sessão demonstrativa e o drawer de visualização. Execute `pnpm lint`, `pnpm test` e `pnpm build` antes de publicar alterações.

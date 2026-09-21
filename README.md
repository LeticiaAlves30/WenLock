# Wenlock

Fundação de um desafio técnico Full Stack para gerenciamento de usuários. Esta etapa entrega somente a arquitetura executável; o CRUD de usuários será implementado posteriormente.

## Stack

- Monorepo com pnpm workspaces e TypeScript estrito
- Frontend: React, Vite, React Router, TanStack Query, Axios, React Hook Form, Zod, Vitest e React Testing Library
- Backend: NestJS, Prisma, PostgreSQL, class-validator, class-transformer, bcrypt, Swagger e Jest

## Arquitetura

\`\`\`text
.
├── apps/
│   ├── backend/             # API NestJS
│   │   ├── prisma/          # schema Prisma (sem entidades nesta etapa)
│   │   ├── src/
│   │   │   ├── common/      # infraestrutura compartilhada (Prisma)
│   │   │   ├── config/      # configurações centralizadas
│   │   │   └── modules/     # módulos da aplicação (health)
│   │   └── test/
│   └── frontend/            # SPA React/Vite
│       └── src/
│           ├── app/         # composição da aplicação
│           ├── pages/       # páginas de rota
│           ├── routes/      # definição de rotas
│           └── services/    # cliente HTTP centralizado
├── packages/shared/         # tipos e constantes compartilháveis no futuro
├── docker-compose.yml       # PostgreSQL local
├── pnpm-workspace.yaml
└── tsconfig.base.json
\`\`\`

## Pré-requisitos

- Node.js 22+ (testado com Node 24)
- pnpm 10+ (\`corepack enable\` caso necessário)
- Docker e Docker Compose

## Instalação e configuração

\`\`\`bash
pnpm install
Copy-Item apps/frontend/.env.example apps/frontend/.env
Copy-Item apps/backend/.env.example apps/backend/.env
docker compose up -d
\`\`\`

No macOS/Linux, substitua \`Copy-Item\` por \`cp\`.

## Execução

\`\`\`bash
pnpm dev
\`\`\`

Ou execute cada aplicação isoladamente:

\`\`\`bash
pnpm dev:frontend
pnpm dev:backend
\`\`\`

## URLs locais

- Web: http://localhost:5173
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Health check: http://localhost:3000/api/health
- PostgreSQL: localhost:5432

## Scripts

\`\`\`bash
pnpm dev       # inicia frontend e backend
pnpm build     # compila todos os pacotes
pnpm lint      # executa ESLint/typecheck aplicável
pnpm test      # executa testes
pnpm format    # formata o repositório com Prettier
\`\`\`

## Decisões iniciais

- Variáveis de ambiente são centralizadas em \`src/config\` no backend e em \`src/config/env.ts\` no frontend.
- A API usa o prefixo global \`/api\`, CORS para a aplicação local e validação global preparada para os futuros DTOs.
- Prisma já está encapsulado em \`PrismaModule\`/\`PrismaService\`, sem modelo ou migration de usuário.
- \`packages/shared\` não contém regras de negócio, apenas pontos de extensão para tipos e constantes.

## Modelagem de dados

O modelo de persistência inicial de User está documentado em [docs/data-model.md](docs/data-model.md). Ele inclui UUID, e-mail e matrícula únicos, hash de senha e timestamps automáticos, sem endpoints ou regras de CRUD nesta etapa.

## Contrato da API

Os DTOs, validações e contratos planejados de usuários estão em [docs/api-contract.md](docs/api-contract.md). Os schemas também ficam disponíveis no Swagger em /api/docs; endpoints serão implementados em etapa posterior.

# Modelo de dados

## User

| Campo | Tipo | Regra |
| --- | --- | --- |
| id | UUID | Chave primária gerada pelo banco/Prisma |
| name | texto | Nome do usuário |
| email | texto | Único |
| registration | texto | Única |
| passwordHash | texto | Apenas o hash da senha |
| createdAt | timestamp | Preenchido automaticamente na criação |
| updatedAt | timestamp | Atualizado automaticamente pelo Prisma |

O UUID evita IDs sequenciais expostos e torna a geração de identificadores independente do banco. E-mail e matrícula possuem constraints únicas; as constraints também criam os índices únicos necessários, sem índices redundantes.

A matrícula é armazenada como string para preservar zeros à esquerda e porque representa um identificador, não um valor destinado a operações matemáticas. A senha nunca é persistida em texto puro: apenas passwordHash será armazenado.

Nesta etapa não há soft delete: exclusões futuras serão físicas. A camada de aplicação deverá normalizar o e-mail antes da persistência, preferencialmente removendo espaços laterais e convertendo-o para minúsculas.

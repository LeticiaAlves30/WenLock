# Contrato da API de usuários

Esta é a interface pública de usuários. O controller expõe os endpoints abaixo e delega regras de negócio ao service.

## Endpoints

| Método | Rota | Sucesso | Descrição |
| --- | --- | --- | --- |
| POST | /api/users | 201 Created | Cria um usuário |
| GET | /api/users | 200 OK | Lista usuários paginados |
| GET | /api/users/:id | 200 OK | Obtém um usuário por UUID |
| PATCH | /api/users/:id | 200 OK | Atualiza parcialmente um usuário |
| DELETE | /api/users/:id | 204 No Content | Exclui fisicamente um usuário |

Os parâmetros :id serão validados como UUID pelo controller quando ele for implementado.

## Requests

### Criar usuário

~~~json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "registration": "001234",
  "password": "abc123"
}
~~~

Nome aceita apenas letras (inclusive acentuadas) e espaços. Matrícula contém somente dígitos e permanece como string. A senha tem exatamente seis caracteres alfanuméricos.

PATCH /api/users/:id aceita qualquer subconjunto desses campos. A senha é opcional na atualização; se estiver ausente, a camada de serviço futura preservará o hash atual.

### Listar usuários

~~~http
GET /api/users?page=1&limit=10&search=maria
~~~

page começa em 1 e tem padrão 1. limit tem padrão 10, mínimo 1 e máximo 100. search será aplicado futuramente como filtro parcial e case-insensitive por nome; espaços laterais e busca vazia serão tratados pela camada de aplicação.

Resposta planejada:

~~~json
{
  "data": [
    {
      "id": "c0a8012e-0123-4abc-8def-0123456789ab",
      "name": "Maria Silva",
      "email": "maria@email.com",
      "registration": "001234",
      "createdAt": "2026-09-19T00:00:00.000Z",
      "updatedAt": "2026-09-19T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 35,
    "totalPages": 4
  }
}
~~~

As respostas públicas nunca incluem password ou passwordHash.

## Erros

O formato de erro seguirá o padrão NestJS:

~~~json
{
  "statusCode": 409,
  "message": "E-mail já cadastrado",
  "error": "Conflict"
}
~~~

| Status | Uso reservado |
| --- | --- |
| 400 Bad Request | Falhas de validação de DTO ou campos não permitidos |
| 404 Not Found | Usuário inexistente |
| 409 Conflict | E-mail ou matrícula já cadastrados |
| 500 Internal Server Error | Falha inesperada |

O Swagger em /api/docs expõe a tag Users, os schemas dos DTOs e as operações documentadas.

## Pendências de infraestrutura

- validação das queries contra PostgreSQL real;
- constraints únicas reais;
- migration aplicada;
- testes de integração;
- testes end-to-end.

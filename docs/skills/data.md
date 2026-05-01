# Data Skills - VANN Mobile

## Estado de Dados Atual

O app atualmente usa dados locais mockados para simular comportamento de produto.

Fonte central:
- `hooks/useMockData.ts`

Colecoes mockadas:
- `mocks/drivers`
- `mocks/routes`
- `mocks/messages`
- `mocks/contracts`
- `mocks/notifications`
- `mocks/payments`
- `mocks/earnings`
- `mocks/vehicle-validations`
- `mocks/expenses`

---

## Tipos de Dominio

Tipos principais:
- `types/user.ts`
- `types/driver.ts`
- `types/route.ts`
- `types/vehicle.ts`
- `types/earnings.ts`
- `types/expenses.ts`
- `types/common.ts`

Diretriz:
- Qualquer mudanca de estrutura de dados deve atualizar tipo + mock + consumo em tela.

---

## Hook `useMockData`

Responsabilidades:
- Expor colecoes mockadas memoizadas.
- Expor helpers de busca/filtragem por ID e relacionamentos simples.

Regras:
- Nao colocar efeitos colaterais no hook.
- Evitar logica de negocio complexa; manter somente acesso e filtros basicos.
- Quando migrar para API real, preservar a assinatura publica do hook sempre que possivel para reduzir impacto nas telas.

---

## Estrategia de Migracao para Dados Reais

Passo a passo sugerido:
1. Criar camada `services/` para chamadas HTTP.
2. Definir DTOs de entrada/saida alinhados a `types/`.
3. Trocar consumo tela a tela (com feature flag ou fallback).
4. Manter mocks apenas para desenvolvimento offline/local quando necessario.

---

## Riscos Atuais

- Inconsistencia entre mock e contrato real de backend.
- Falta de estados de erro/rede reais.
- Sem persistencia de cache/sessao.

Mitigacao inicial:
- Definir contratos de API antes da troca em massa.
- Priorizar fluxos criticos: auth, dashboard, rotas, historico.

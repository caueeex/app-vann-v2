# Integration Skills - VANN Mobile

## Objetivo

Guiar a migracao de `mocks/` para API real com baixo risco e pouca regressao de UX.

---

## Arquitetura Recomendada

Estrutura sugerida:

```
services/
  api/
    client.ts          -> instancia HTTP e interceptors
    auth.ts            -> login/register/logout/me
    parent.ts          -> endpoints do fluxo parent
    driver.ts          -> endpoints do fluxo driver
  storage/
    session.ts         -> persistencia local de token/sessao
```

Opcional:
- Camada `repositories/` quando houver regras de transformacao maiores entre API e UI.

---

## Contratos Minimos Iniciais

Prioridade de integracao:
1. **Auth**
   - login
   - register
   - logout
   - me/perfil
2. **Parent**
   - dashboard
   - busca de condutores
   - historico
3. **Driver**
   - dashboard
   - rotas
   - historico

Recomendacao:
- Definir schemas de validacao (ex.: Zod) para payloads antes de popular estado global.

---

## Sessao e Seguranca

Diretrizes:
- Persistir token/sessao com `expo-secure-store` (preferencial) ou fallback seguro.
- Evitar armazenar dados sensiveis em plain text.
- Implementar renovacao/invalidacao de sessao de forma centralizada no client HTTP.

---

## Tratamento de Erros

Padrao recomendado:
- Normalizar erros de rede em um utilitario unico.
- Exibir mensagem amigavel na UI.
- Manter detalhe tecnico apenas para logs internos.

Checklist:
- Timeout
- Falha de conexao
- 401/403
- 422 validacao
- 5xx backend

---

## Testes Minimos Antes de Virar Mock Off

- Fluxo completo de login/logout.
- Render de dashboard parent com dados reais.
- Render de dashboard driver com dados reais.
- Navegacao para telas secundarias sem crash.
- Fallback visual para erro e vazio.

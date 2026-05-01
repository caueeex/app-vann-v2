# VANN Mobile - Contexto Arquitetural para Agentes de IA

## Visao Geral do Sistema

**VANN Mobile** e um app Expo/React Native focado em conectar pais/responsaveis e condutores escolares.
O projeto atual esta em fase de produto funcional com foco em UX e navegacao, mas ainda usa dados mockados.

### Proposito Principal
- Permitir que pais acompanhem trajetos e interacoes com condutores.
- Permitir que condutores gerenciem rotas, alunos, ganhos e operacao diaria.
- Reunir recursos compartilhados de seguranca, pagamentos e configuracoes.

---

## Arquitetura Tecnica

### Stack Principal
- **Mobile**: Expo SDK 54 + React Native 0.81 + React 19 + TypeScript
- **Roteamento**: Expo Router (file-based routing)
- **Navegacao**: React Navigation via Expo Router
- **Estado**: Context API (`AuthContext`, `UserContext`, `ThemeContext`)
- **Dados**: mocks locais via `hooks/useMockData.ts`
- **Tema/Design System**: tokens em `constants/colors.ts`, `constants/typography.ts`, `constants/theme.ts`

### Principios Arquiteturais
1. **Roteamento por grupos**: separacao por fluxo (`(auth)`, `(onboarding)`, `(parent)`, `(driver)`, `(shared)`).
2. **Tipagem forte**: tipos centralizados em `types/`.
3. **UI reutilizavel**: componentes em `components/ui/`.
4. **Contextos globais claros**: auth, dados de usuario e tema separados.
5. **Evolucao orientada a integracao**: estrutura pronta para migrar de mock para API real.

### Estrutura de Pastas

```
app/
  _layout.tsx         -> layout raiz com providers globais
  (onboarding)/       -> fluxo de onboarding
  (auth)/             -> login, cadastro, recuperacao de senha
  (parent)/           -> area do responsavel/pai
  (driver)/           -> area do condutor
  (shared)/           -> telas compartilhadas entre perfis
components/
  ui/                 -> componentes reutilizaveis de interface
contexts/             -> AuthContext, UserContext, ThemeContext
hooks/                -> hooks de auth, tema, permissao e dados mockados
mocks/                -> fontes de dados locais para desenvolvimento
types/                -> contratos de tipos TypeScript
constants/            -> tokens de tema, cores e tipografia
utils/                -> validadores, formatadores e utilitarios gerais
```

---

## Modelo de Usuarios (RBAC no App)

| Role | Acesso principal |
|------|------------------|
| `parent` | Dashboard, busca de condutores, historico, chat, perfil |
| `driver` | Dashboard, rotas, historico, perfil, operacao (veiculo, alunos, ganhos, etc.) |

**Observacao**: Atualmente o role e definido por dados mockados/contexto local.

---

## Estado Atual do Projeto

### Implementado
- Fluxos de onboarding e autenticacao no app.
- Areas dedicadas para `parent` e `driver`.
- Telas compartilhadas de configuracoes, privacidade, termos, pagamentos e seguranca.
- Base de design system e tipagem consistente.

### Pendente para producao
- Integracao com backend real.
- Persistencia de sessao/token (ex.: AsyncStorage/SecureStore).
- Tratamento de erros de rede e estados offline.
- Testes automatizados e CI.

---

## Convencoes Obrigatorias

### Estrutura e navegacao
- Novas telas devem seguir a convencao de grupos em `app/`.
- Manter `_layout.tsx` por grupo para controlar navegacao.
- Evitar logica de negocio pesada dentro dos layouts.

### Tipagem e imports
- Definir/atualizar tipos em `types/` antes de expandir features.
- Usar alias `@/` para imports internos.
- Evitar `any`; preferir tipos explicitos e unioes.

### Estado e dados
- `AuthContext` concentra sessao e ciclo de login/logout.
- `UserContext` concentra role e dados de perfil.
- `useMockData` deve ser tratado como camada temporaria de dados.

### UI e tema
- Reutilizar tokens de `constants/theme.ts` e `constants/colors.ts`.
- Preferir componentes de `components/ui/` a estilos duplicados por tela.

---

## Documentacao Adicional

Para detalhes especificos, consulte:
- `docs/skills/mobile.md` - stack, fluxo de rotas e estado global
- `docs/skills/frontend.md` - padroes de UI, componentes e temas
- `docs/skills/data.md` - modelo de dados locais, mocks e tipos
- `docs/skills/integration.md` - plano e padroes para integrar API real

Regra: carregar apenas a documentacao necessaria para a tarefa atual.

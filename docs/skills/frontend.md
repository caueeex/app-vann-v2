# Frontend Skills - VANN Mobile

## Design System e Tema

Arquivos principais:
- `constants/colors.ts`
- `constants/typography.ts`
- `constants/theme.ts`

Uso esperado:
- Cores semanticas e primarias vindas de tokens.
- Tipografia, espacamento e bordas padronizados por constantes.
- Evitar hardcode de cores e tamanhos em telas quando ja houver token equivalente.

---

## Componentizacao

Diretrizes:
- Componentes compartilhados em `components/ui/`.
- Telas devem focar em composicao e fluxo, nao em duplicar blocos visuais.
- Quando um padrao aparecer em 2+ telas, extrair componente.

Padrao sugerido:
1. Tela importa dados/estado.
2. Tela usa componentes de secao/cartoes/listas.
3. Componentes atomicos ficam em `components/ui/`.

---

## Navegacao por Perfil

### Parent (`app/(parent)/_layout.tsx`)
- Tabs principais: `dashboard`, `search-drivers`, `profile`, `chat`.
- Rotas internas escondidas (`href: null`) para detalhes e fluxos secundarios.

### Driver (`app/(driver)/_layout.tsx`)
- Tabs principais: `dashboard`, `routes`, `history`, `profile`.
- Rotas operacionais extras ficam ocultas na tabbar.

### Shared (`app/(shared)/_layout.tsx`)
- Stack para telas transversais (configuracoes, seguranca, termos, pagamentos, etc.).

---

## Acessibilidade e UX

Checklist minimo por tela:
- Titulo claro e hierarquia visual consistente.
- Estados de loading, vazio e erro.
- Toques e alvos com tamanho adequado.
- Labels acessiveis em botoes e inputs criticos.

---

## Convencoes de Codigo

- Usar alias `@/` para imports locais.
- Evitar `any`, preferir tipos definidos em `types/`.
- Manter arquivos de tela focados em fluxo; mover utilitarios para `utils/`.
- Para logica compartilhada entre telas, criar hook em `hooks/`.

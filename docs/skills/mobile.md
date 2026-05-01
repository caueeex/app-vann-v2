# Mobile Skills - VANN

## Stack

| Tecnologia | Versao | Uso |
|---|---|---|
| Expo | ~54.0.31 | Plataforma React Native |
| React Native | 0.81.5 | Camada mobile |
| React | 19.1.0 | UI |
| TypeScript | ~5.9.2 | Tipagem estatica |
| Expo Router | ~6.0.21 | Roteamento file-based |
| React Navigation | 7.x | Navegacao (via router) |
| Reanimated | ~4.1.1 | Animacoes |
| Safe Area Context | ~5.6.0 | Insets/safe areas |

---

## Estrutura de Rotas

```
app/
  _layout.tsx
  (onboarding)/
    welcome.tsx
    security.tsx
    tracking.tsx
    communication.tsx
    select-profile.tsx
  (auth)/
    login.tsx
    register.tsx
    forgot-password.tsx
    reset-password.tsx
  (parent)/
    dashboard.tsx
    search-drivers.tsx
    profile.tsx
    history.tsx
  (driver)/
    dashboard.tsx
    routes.tsx
    history.tsx
    profile.tsx
  (shared)/
    settings.tsx
    notifications.tsx
    security-center.tsx
    payments.tsx
    terms.tsx
    privacy.tsx
```

---

## Providers Globais

Em `app/_layout.tsx`, a hierarquia de providers e:
1. `AuthProvider`
2. `UserProvider`
3. `ThemeProvider` custom
4. `ThemeProvider` do React Navigation

Essa ordem deve ser mantida para evitar efeitos colaterais de contexto.

---

## Contextos

### AuthContext (`contexts/AuthContext.tsx`)
- Expoe `user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout`, `updateUser`.
- Fluxo atual e mockado (simulacao de latencia e usuario local).
- Ponto natural para futura integracao com API + persistencia de token.

### UserContext (`contexts/UserContext.tsx`)
- Guarda `userRole`, `parentData`, `driverData`, `selectedChild`.
- Serve como cache leve de estado de sessao por perfil.

### ThemeContext (`contexts/ThemeContext.tsx`)
- Centraliza comportamento de tema para uso em toda a interface.

---

## Scripts Uteis

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

---

## Convencoes

- Novas telas devem ser adicionadas no grupo correto em `app/`.
- Evitar acoplamento de UI diretamente ao mock quando a feature ja tiver contrato de API definido.
- Manter tipagem em `types/` sincronizada com payloads/entidades.
- Reutilizar componentes em `components/ui/` para consistencia visual.

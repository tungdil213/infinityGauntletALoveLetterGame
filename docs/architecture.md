# Architecture Technique

## Vue d'ensemble

L'application suit les principes de **Clean Architecture** avec une organisation basée sur les **features** (domaines métier). Cette approche garantit une séparation claire des responsabilités et une maintenabilité optimale.

## Structure Générale

### Organisation par Features

```
src/features/
├── lobbies/           # Gestion des lobbies de jeu
├── players/           # Gestion des joueurs
├── users/             # Authentification et utilisateurs
├── dashboard/         # Interface utilisateur principale
├── backoffice/        # Administration
└── shared/            # Types et utilitaires partagés
```

### Couches d'Architecture

Chaque feature respecte la structure suivante :

```
feature/
├── app/
│   ├── controllers/   # Couche présentation (HTTP)
│   └── services/      # Use Cases (logique applicative)
├── domain/
│   ├── entities/      # Entités métier
│   ├── repositories/  # Interfaces de persistance
│   ├── services/      # Services domaine
│   ├── DTO/          # Data Transfer Objects
│   └── types/        # Types TypeScript
└── infrastructure/
    ├── repositories/  # Implémentations concrètes
    └── routes/       # Définition des routes
```

## Patterns Utilisés

### 1. Clean Architecture

**Flux de données** : Controllers → Use Cases → Domain Services → Repositories

```typescript
// Exemple : ListLobbiesController
@inject()
export default class ListLobbiesController {
  constructor(private listExistingLobbiesUseCase: ListExistingLobbiesUseCase) {}

  async handle({ inertia }: HttpContext) {
    const lobbies = await this.listExistingLobbiesUseCase.handle()
    return inertia.render('lobby/list', { lobbies })
  }
}
```

### 2. Dependency Injection

Utilisation du décorateur `@inject()` d'AdonisJS pour l'injection de dépendances :

```typescript
@inject()
export default class ListExistingLobbiesUseCase {
  constructor(private lobbyService: LobbyService) {}
  
  async handle() {
    return await this.lobbyService.listLobbies()
  }
}
```

### 3. Repository Pattern

Abstraction de la couche de persistance avec des interfaces :

```typescript
// Interface
export abstract class SessionRepository {
  abstract saveSession(session: SessionDTO): Promise<void>
  abstract listSessions(): Promise<SessionDTO[]>
  abstract getSessionByUUID(uuid: string): Promise<SessionDTO | null>
}

// Implémentation
export class DatabaseSessionRepository extends SessionRepository {
  async saveSession(session: SessionDTO): Promise<void> {
    await Session.create({
      uuid: session.uuid,
      name: session.name,
      status: session.status,
    })
  }
}
```

### 4. DTO (Data Transfer Objects)

Objets pour le transfert de données entre les couches :

```typescript
export interface SessionDTO {
  uuid: string
  name: string
  status: SessionStatus
  players: PlayerDTO[]
}
```

## Stack Technique

### Backend

- **Framework** : AdonisJS v6+
- **Langage** : TypeScript
- **ORM** : Lucid (intégré à AdonisJS)
- **Base de données** : PostgreSQL
- **Authentification** : AdonisJS Auth

### Frontend

- **Framework** : React 18
- **SSR** : Inertia.js
- **Styling** : Tailwind CSS
- **Build** : Vite

### Infrastructure

- **Package Manager** : pnpm
- **Linting** : ESLint + Prettier
- **Testing** : Japa (framework de test AdonisJS)

## Modèles de Données

### Entités Principales

```typescript
// User - Utilisateur authentifié
interface User {
  id: number
  uuid: string
  email: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

// Player - Profil joueur
interface Player {
  id: number
  nickName: string
  userId: number
  user: User
}

// Session - Lobby/Partie
interface Session {
  id: number
  uuid: string
  name: string
  status: SessionStatus
  players: Player[]
}
```

### Relations

- **User** `1:1` **Player** : Un utilisateur a un profil joueur
- **Session** `N:M` **Player** : Une session peut avoir plusieurs joueurs
- **Player** `N:M` **Session** : Un joueur peut participer à plusieurs sessions

## États des Sessions

```typescript
export const SESSION_STATUS = {
  LOBBY: 'LOBBY',     // En attente de joueurs
  PARTY: 'PARTY',     // Partie en cours
  FINISHED: 'FINISHED', // Partie terminée
  WAITING: 'WAITING',   // En attente
  OPEN: 'OPEN',        // Ouvert aux nouveaux joueurs
  READY: 'READY',      // Prêt à commencer
  FULL: 'FULL',        // Complet
} as const
```

## Configuration et Providers

### Providers de Services

Les providers configurent l'injection de dépendances :

```typescript
// SessionProvider
export default class SessionProvider {
  register() {
    this.app.container.bind(SessionRepository, () => {
      return new DatabaseSessionRepository()
    })
  }
}
```

### Configuration des Routes

Organisation modulaire des routes par feature :

```typescript
// lobby_routes.ts
router
  .group(() => {
    router.get('/', [ListLobbiesController]).as('lobby.list')
    router.post('/create', [CreateLobbyController]).as('lobby.create')
    router.get('/:lobbyId', [ShowLobbyController]).as('lobby.show')
  })
  .prefix('lobby')
  .use(middleware.auth())
```

## Avantages de cette Architecture

1. **Séparation des responsabilités** : Chaque couche a un rôle bien défini
2. **Testabilité** : Facilite les tests unitaires et d'intégration
3. **Maintenabilité** : Code organisé et facile à modifier
4. **Évolutivité** : Ajout de nouvelles features sans impact sur l'existant
5. **Réutilisabilité** : Composants découplés et réutilisables

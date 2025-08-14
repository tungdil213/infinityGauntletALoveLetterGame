# Système de Lobbies

## Vue d'ensemble

Le système de lobbies permet aux joueurs de créer et rejoindre des salles de jeu pour des parties multijoueurs d'Infinity Gauntlet Love Letter. Il gère l'état des sessions, l'ajout/suppression de joueurs, et la transition vers les parties.

## Architecture du Système

### Entités Principales

#### Session/Lobby
```typescript
interface SessionDTO {
  uuid: string          // Identifiant unique
  name: string          // Nom du lobby (ex: "Lobby abc123")
  status: SessionStatus // État actuel
  players: PlayerDTO[]  // Liste des joueurs
}
```

#### États des Sessions
```typescript
export const SESSION_STATUS = {
  OPEN: 'OPEN',           // Ouvert, accepte de nouveaux joueurs
  LOBBY: 'LOBBY',         // En attente dans le lobby
  READY: 'READY',         // Prêt à commencer la partie
  FULL: 'FULL',           // Lobby complet
  PARTY: 'PARTY',         // Partie en cours
  WAITING: 'WAITING',     // En attente (pause, reconnexion)
  FINISHED: 'FINISHED'    // Partie terminée
}
```

## Flux de Fonctionnement

### 1. Création d'un Lobby

**Endpoint** : `POST /lobby/create`

```typescript
// CreateLobbyController
async handle({ auth, inertia }: HttpContext) {
  const userUUID = auth.user!.uuid
  const lobby = await this.createNewLobbyUseCase.handle(userUUID)
  return inertia.render('lobby/show', { lobby })
}
```

**Processus** :
1. Récupération du joueur via son UUID utilisateur
2. Création d'une nouvelle instance `Lobby` avec le joueur créateur
3. Sauvegarde en base de données
4. Redirection vers la vue du lobby

### 2. Liste des Lobbies

**Endpoint** : `GET /lobby`

```typescript
// ListLobbiesController
async handle({ inertia }: HttpContext) {
  const lobbies = await this.listExistingLobbiesUseCase.handle()
  return inertia.render('lobby/list', { lobbies })
}
```

**Affichage** :
- Tous les lobbies avec statut `OPEN` ou `LOBBY`
- Informations : nom, nombre de joueurs, statut
- Actions : rejoindre, observer

### 3. Rejoindre un Lobby

**Endpoint** : `POST /lobby/join`

**Conditions** :
- Lobby doit être `OPEN` ou `LOBBY`
- Nombre maximum de joueurs non atteint
- Joueur pas déjà dans le lobby

### 4. Quitter un Lobby

**Endpoint** : `POST /lobby/leave`

**Effets** :
- Suppression du joueur de la session
- Si créateur quitte : transfert ou suppression du lobby
- Mise à jour du statut si nécessaire

## Classes et Services

### Entités Domaine

#### `SessionBase`
Classe abstraite de base pour toutes les sessions :

```typescript
export default abstract class SessionBase {
  protected _uuid: string
  protected _status: SessionStatus
  protected _name: string

  constructor() {
    this._uuid = this.generateId()
    this._status = SESSION_STATUS.OPEN
    this._name = `Lobby ${this._uuid}`
  }

  protected changeStatus(status: SessionStatus): void {
    this._status = status
  }
}
```

#### `Lobby`
Gestion spécifique des lobbies d'attente :

```typescript
export default class Lobby extends SessionWithPlayers {
  // Logique spécifique aux lobbies
  // - Ajout/suppression de joueurs
  // - Validation des conditions de démarrage
  // - Transition vers PartyGame
}
```

#### `PartyGame`
Gestion des parties en cours :

```typescript
export default class PartyGame extends SessionBase {
  private _players: PlayerInterface[]
  
  constructor(players: PlayerInterface[]) {
    super()
    this._players = players
  }
}
```

### Services Applicatifs

#### `CreateNewLobbyUseCase`
```typescript
export default class CreateNewLobbyUseCase {
  async handle(userUUID: string) {
    const player = await this.playerRepository.findByUUID(userUUID)
    const lobby = new Lobby(player).toJSON()
    await this.lobbyRepository.saveSession(lobby)
    return lobby
  }
}
```

#### `ListExistingLobbiesUseCase`
```typescript
export default class ListExistingLobbiesUseCase {
  async handle() {
    return await this.lobbyService.listLobbies()
  }
}
```

### Repositories

#### `SessionRepository`
Interface abstraite pour la persistance :

```typescript
export abstract class SessionRepository {
  abstract saveSession(session: SessionDTO): Promise<void>
  abstract listSessions(): Promise<SessionDTO[]>
  abstract getSessionByUUID(uuid: string): Promise<SessionDTO | null>
  abstract deleteSession(uuid: string): Promise<void>
}
```

#### Implémentations

**`DatabaseSessionRepository`** : Persistance en base PostgreSQL
**`InMemorySessionRepository`** : Stockage en mémoire (développement/tests)

## Interface Utilisateur

### Pages Principales

#### `/lobby` - Liste des Lobbies
- Affichage de tous les lobbies disponibles
- Filtres par statut, nombre de joueurs
- Actions : créer, rejoindre, observer

#### `/lobby/:lobbyId` - Vue Lobby
- Détails du lobby sélectionné
- Liste des joueurs connectés
- Chat du lobby
- Actions : quitter, démarrer partie (si créateur)

### Composants React

```typescript
// Exemple de composant lobby
interface LobbyListProps {
  lobbies: SessionDTO[]
}

export default function LobbyList({ lobbies }: LobbyListProps) {
  return (
    <div className="grid gap-4">
      {lobbies.map(lobby => (
        <LobbyCard key={lobby.uuid} lobby={lobby} />
      ))}
    </div>
  )
}
```

## Gestion des États

### Transitions d'États

```
OPEN → LOBBY → READY → PARTY → FINISHED
  ↓      ↓       ↓       ↓
 FULL   FULL   FULL   WAITING
```

### Règles de Transition

1. **OPEN → LOBBY** : Premier joueur rejoint
2. **LOBBY → READY** : Nombre minimum de joueurs atteint
3. **READY → PARTY** : Démarrage de la partie
4. **PARTY → FINISHED** : Fin de partie
5. **\* → FULL** : Nombre maximum de joueurs atteint

## Sécurité et Validation

### Authentification
- Toutes les routes lobbies nécessitent une authentification
- Middleware `auth()` appliqué sur le groupe de routes

### Validations Métier
- Vérification des droits (créateur vs participant)
- Validation des transitions d'état
- Contrôle du nombre de joueurs
- Prévention des doublons

### Gestion d'Erreurs
```typescript
// Exemple de validation
protected validateAndAddPlayer(player: PlayerInterface) {
  if (!this.sessionIsOpen()) {
    throw new Error("Can't add players to a closed session")
  }
  
  if (this.searchPlayerByUUID(player.uuid) !== undefined) {
    throw new Error('Player already in this session')
  }
  
  this.addPlayerToSession(player)
}
```

## Performance et Optimisation

### Stratégies de Cache
- Cache des lobbies actifs en mémoire
- Invalidation lors des modifications
- Pagination pour les listes importantes

### Temps Réel
- WebSockets pour les mises à jour en temps réel
- Notifications des changements d'état
- Synchronisation des listes de joueurs

## Monitoring et Logs

### Événements Trackés
- Création/suppression de lobbies
- Ajout/suppression de joueurs
- Transitions d'état
- Erreurs et exceptions

### Métriques
- Nombre de lobbies actifs
- Temps moyen en lobby
- Taux de conversion lobby → partie

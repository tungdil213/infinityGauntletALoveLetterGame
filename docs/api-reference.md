# API Reference

## Vue d'ensemble

Cette documentation présente tous les endpoints disponibles dans l'API de l'application Infinity Gauntlet Love Letter. L'API suit les conventions REST et utilise l'authentification par session.

## Authentification

### Base URL
```
http://localhost:3333
```

### Authentification
Toutes les routes protégées nécessitent une session authentifiée. L'authentification se fait via cookies de session.

### Headers Requis
```
Content-Type: application/json
X-CSRF-TOKEN: <token> (pour les requêtes POST/PUT/DELETE)
```

## Endpoints d'Authentification

### POST /register
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "username": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response 201:**
```json
{
  "user": {
    "uuid": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string"
  }
}
```

### POST /login
Connexion utilisateur.

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "remember_me": "boolean"
}
```

**Response 200:**
```json
{
  "user": {
    "uuid": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string"
  }
}
```

### POST /logout
Déconnexion utilisateur.

**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

## Endpoints Joueurs

### GET /player/me
Récupération du profil du joueur connecté.

**Headers:** `Authorization: Bearer <session>`

**Response 200:**
```json
{
  "user": {
    "uuid": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "avatarUrl": "string"
  },
  "player": {
    "uuid": "string",
    "nickName": "string"
  }
}
```

## Endpoints Lobbies

### GET /lobby
Liste tous les lobbies disponibles.

**Headers:** `Authorization: Bearer <session>`

**Query Parameters:**
- `status` (optional): Filtrer par statut (`OPEN`, `LOBBY`, `READY`)
- `limit` (optional): Nombre maximum de résultats (défaut: 50)
- `offset` (optional): Décalage pour la pagination (défaut: 0)

**Response 200:**
```json
{
  "lobbies": [
    {
      "uuid": "string",
      "name": "string",
      "status": "OPEN|LOBBY|READY|PARTY|FINISHED",
      "players": [
        {
          "uuid": "string",
          "nickName": "string"
        }
      ],
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### POST /lobby/create
Création d'un nouveau lobby.

**Headers:** `Authorization: Bearer <session>`

**Body:**
```json
{
  "name": "string" // Optionnel, généré automatiquement si absent
}
```

**Response 201:**
```json
{
  "lobby": {
    "uuid": "string",
    "name": "string",
    "status": "OPEN",
    "players": [
      {
        "uuid": "string",
        "nickName": "string"
      }
    ],
    "createdAt": "ISO8601"
  }
}
```

### GET /lobby/:lobbyId
Détails d'un lobby spécifique.

**Headers:** `Authorization: Bearer <session>`

**Parameters:**
- `lobbyId`: UUID du lobby

**Response 200:**
```json
{
  "lobby": {
    "uuid": "string",
    "name": "string",
    "status": "string",
    "players": [
      {
        "uuid": "string",
        "nickName": "string"
      }
    ],
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

**Response 404:**
```json
{
  "error": "Lobby not found"
}
```

### POST /lobby/join
Rejoindre un lobby existant.

**Headers:** `Authorization: Bearer <session>`

**Body:**
```json
{
  "lobbyId": "string"
}
```

**Response 200:**
```json
{
  "message": "Successfully joined lobby",
  "lobby": {
    "uuid": "string",
    "name": "string",
    "status": "string",
    "players": [...]
  }
}
```

**Response 400:**
```json
{
  "error": "Cannot join lobby",
  "reason": "LOBBY_FULL|ALREADY_IN_LOBBY|LOBBY_CLOSED"
}
```

### POST /lobby/leave
Quitter un lobby.

**Headers:** `Authorization: Bearer <session>`

**Body:**
```json
{
  "lobbyId": "string"
}
```

**Response 200:**
```json
{
  "message": "Successfully left lobby"
}
```

**Response 400:**
```json
{
  "error": "Cannot leave lobby",
  "reason": "NOT_IN_LOBBY|GAME_IN_PROGRESS"
}
```

## Endpoints Dashboard

### GET /dashboard
Page d'accueil du joueur connecté.

**Headers:** `Authorization: Bearer <session>`

**Response 200:**
```json
{
  "user": {
    "uuid": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string"
  },
  "stats": {
    "gamesPlayed": "number",
    "gamesWon": "number",
    "winRate": "number",
    "currentStreak": "number"
  },
  "recentGames": [
    {
      "uuid": "string",
      "result": "WIN|LOSS",
      "players": ["string"],
      "playedAt": "ISO8601"
    }
  ],
  "activeLobbies": [
    {
      "uuid": "string",
      "name": "string",
      "status": "string"
    }
  ]
}
```

## Endpoints Backoffice (Admin)

### GET /backoffice
Interface d'administration.

**Headers:** `Authorization: Bearer <admin_session>`

**Response 200:**
```json
{
  "stats": {
    "totalUsers": "number",
    "activeUsers": "number",
    "totalGames": "number",
    "activeLobbies": "number"
  },
  "recentActivity": [
    {
      "type": "USER_REGISTERED|GAME_STARTED|LOBBY_CREATED",
      "timestamp": "ISO8601",
      "details": "object"
    }
  ]
}
```

## Codes d'Erreur

### Erreurs d'Authentification
- `401 Unauthorized`: Session expirée ou invalide
- `403 Forbidden`: Permissions insuffisantes
- `422 Unprocessable Entity`: Données de validation invalides

### Erreurs Métier
- `400 Bad Request`: Action non autorisée (ex: rejoindre un lobby plein)
- `404 Not Found`: Ressource non trouvée
- `409 Conflict`: Conflit d'état (ex: joueur déjà dans le lobby)

### Erreurs Serveur
- `500 Internal Server Error`: Erreur serveur interne
- `503 Service Unavailable`: Service temporairement indisponible

## Formats de Réponse

### Succès
```json
{
  "data": "object|array",
  "message": "string", // Optionnel
  "meta": {            // Optionnel pour pagination
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Erreur
```json
{
  "error": "string",
  "message": "string",
  "details": "object", // Optionnel
  "code": "string"     // Code d'erreur spécifique
}
```

## Validation des Données

### Règles de Validation

#### Utilisateur
- `firstName`: 2-50 caractères, lettres uniquement
- `lastName`: 2-50 caractères, lettres uniquement  
- `username`: 3-30 caractères, alphanumériques et underscore
- `email`: Format email valide, unique
- `password`: 8+ caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre

#### Lobby
- `name`: 3-100 caractères (optionnel)

## Rate Limiting

### Limites par Endpoint
- **Authentification**: 5 tentatives/minute par IP
- **Création lobby**: 10 créations/heure par utilisateur
- **API générale**: 100 requêtes/minute par utilisateur

### Headers de Rate Limiting
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## WebSockets (Temps Réel)

### Connexion
```javascript
const socket = io('/lobby', {
  auth: {
    token: sessionToken
  }
})
```

### Événements Lobby

#### Écoute
```javascript
socket.on('lobby:updated', (lobby) => {
  // Mise à jour du lobby
})

socket.on('lobby:player_joined', (player) => {
  // Nouveau joueur
})

socket.on('lobby:player_left', (player) => {
  // Joueur parti
})

socket.on('lobby:game_started', (gameData) => {
  // Partie démarrée
})
```

#### Émission
```javascript
socket.emit('lobby:join', { lobbyId: 'uuid' })
socket.emit('lobby:leave', { lobbyId: 'uuid' })
socket.emit('lobby:ready', { lobbyId: 'uuid' })
```

## Exemples d'Utilisation

### Flux Complet - Rejoindre une Partie

```javascript
// 1. Connexion
const loginResponse = await fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

// 2. Liste des lobbies
const lobbiesResponse = await fetch('/lobby', {
  credentials: 'include'
})
const { lobbies } = await lobbiesResponse.json()

// 3. Rejoindre un lobby
const joinResponse = await fetch('/lobby/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    lobbyId: lobbies[0].uuid
  })
})

// 4. Connexion WebSocket pour les mises à jour temps réel
const socket = io('/lobby')
socket.on('lobby:game_started', (gameData) => {
  // Rediriger vers l'interface de jeu
  window.location.href = `/game/${gameData.uuid}`
})
```

Cette API reference couvre tous les endpoints principaux de l'application. Pour des détails d'implémentation spécifiques, consultez le code source dans `src/features/*/infrastructure/routes/`.

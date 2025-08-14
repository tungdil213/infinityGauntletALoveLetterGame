# 🎮 Game Module - Infinity Gauntlet Love Letter

## Architecture Overview

Ce module implémente la logique complète du jeu Infinity Gauntlet Love Letter avec une architecture Clean Architecture séparée du système de lobbies.

## Structure du Module

```
src/features/game/
├── README.md                    # Ce fichier
├── app/                        # Couche Application
│   ├── controllers/            # Controllers HTTP pour les actions de jeu
│   │   ├── game_controller.ts
│   │   ├── game_action_controller.ts
│   │   └── game_sse_controller.ts
│   └── services/              # Use Cases / Services applicatifs
│       ├── create_game_use_case.ts
│       ├── play_card_use_case.ts
│       ├── end_turn_use_case.ts
│       └── game_sse_service.ts
├── domain/                    # Couche Domaine (logique métier)
│   ├── entities/             # Entités de jeu
│   │   ├── game.ts
│   │   ├── player.ts
│   │   ├── card.ts
│   │   ├── deck.ts
│   │   └── game_state.ts
│   ├── value-objects/        # Objets de valeur
│   │   ├── card_type.ts
│   │   ├── game_phase.ts
│   │   └── player_action.ts
│   ├── services/            # Services domaine
│   │   ├── card_effect_service.ts
│   │   ├── game_rules_service.ts
│   │   └── victory_service.ts
│   ├── repositories/        # Interfaces de persistance
│   │   └── game_repository.ts
│   ├── events/             # Événements domaine
│   │   ├── card_played_event.ts
│   │   ├── player_eliminated_event.ts
│   │   └── game_ended_event.ts
│   └── types/              # Types TypeScript
│       ├── game_types.ts
│       └── card_types.ts
├── infrastructure/          # Couche Infrastructure
│   ├── repositories/       # Implémentations concrètes
│   │   └── database_game_repository.ts
│   ├── routes/            # Routes HTTP
│   │   └── game_routes.ts
│   └── persistence/       # Modèles de données
│       └── game_model.ts
└── presentation/          # Couche Présentation (React)
    ├── components/        # Composants React
    │   ├── GameBoard.tsx
    │   ├── PlayerHand.tsx
    │   ├── CardComponent.tsx
    │   └── GameActions.tsx
    ├── hooks/            # Hooks React personnalisés
    │   ├── useGame.ts
    │   └── useGameSSE.ts
    └── pages/           # Pages React
        ├── game.tsx
        └── game_over.tsx
```

## Principes Architecturaux

### 1. Séparation des Responsabilités
- **Domain** : Logique métier pure, indépendante de toute technologie
- **Application** : Orchestration des use cases et services
- **Infrastructure** : Détails techniques (DB, HTTP, etc.)
- **Presentation** : Interface utilisateur React

### 2. Inversion de Dépendance
- Les couches internes ne dépendent jamais des couches externes
- Utilisation d'interfaces pour découpler les implémentations

### 3. Immutabilité
- Les entités de jeu sont immutables
- Chaque action crée un nouvel état de jeu

### 4. Event-Driven
- Utilisation d'événements domaine pour découpler les actions
- SSE pour la communication temps réel

## Flux de Données

```
HTTP Request → Controller → Use Case → Domain Service → Repository
                    ↓
SSE Notification ← Event ← Domain Entity ← Game State
```

## Intégration avec les Lobbies

Le module de jeu est complètement indépendant des lobbies, mais s'interface avec eux via :

1. **Transition Lobby → Game** : Création d'une partie depuis un lobby
2. **Game → Lobby** : Retour au lobby après une partie
3. **Événements partagés** : Notifications SSE cross-module

## Technologies Utilisées

- **Backend** : AdonisJS, TypeScript, Lucid ORM
- **Frontend** : React, TypeScript, Tailwind CSS
- **Communication** : SSE + HTTP REST
- **Persistance** : PostgreSQL (parties en cours uniquement)

## Règles de Développement

1. **Aucune dépendance directe** vers le module lobbies
2. **Tests unitaires** pour chaque couche
3. **Documentation** des règles métier dans le code
4. **Validation** stricte des actions de jeu
5. **Gestion d'erreurs** robuste avec rollback d'état

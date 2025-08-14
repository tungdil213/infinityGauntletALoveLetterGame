# Règles du Jeu - Infinity Gauntlet: A Love Letter Game

## Vue d'ensemble

**Infinity Gauntlet: A Love Letter Game** est une adaptation du célèbre jeu de cartes Love Letter avec un thème Marvel. Les joueurs incarnent des héros tentant de collecter les Pierres d'Infinité pour sauver l'univers de Thanos.

> **Note** : Les règles complètes et officielles sont disponibles dans le fichier [Infinity-Gauntlet-Rulebook.pdf](./Infinity-Gauntlet-Rulebook.pdf)

## Objectif du Jeu

Le but est d'être le dernier joueur en vie à la fin d'une manche, ou d'avoir la carte de plus haute valeur si plusieurs joueurs survivent. Le premier joueur à remporter un certain nombre de manches (selon le nombre de joueurs) gagne la partie.

## Composants

### Cartes de Héros
Le jeu contient des cartes représentant différents héros Marvel, chacune avec :
- **Valeur numérique** : Détermine la force du héros
- **Pouvoir spécial** : Effet activé quand la carte est jouée
- **Nombre d'exemplaires** : Quantité de cette carte dans le deck

### Pierres d'Infinité
Les Pierres d'Infinité servent de jetons de victoire, remportées à la fin de chaque manche.

## Configuration de Partie

### Nombre de Joueurs
- **2-4 joueurs** : Parties standard
- **5-8 joueurs** : Parties étendues (si supporté)

### Mise en Place
1. Mélanger le deck de cartes héros
2. Distribuer 1 carte à chaque joueur
3. Placer 1 carte face cachée (carte "brûlée")
4. Le reste forme la pioche
5. Placer les Pierres d'Infinité à portée

## Déroulement d'une Manche

### Tour de Jeu
1. **Piocher** : Le joueur actif pioche 1 carte
2. **Jouer** : Il choisit 1 de ses 2 cartes et la joue face visible
3. **Résoudre** : Appliquer l'effet de la carte jouée
4. **Passer** : Le tour passe au joueur suivant

### Fin de Manche
Une manche se termine quand :
- Il ne reste qu'un seul joueur en vie
- La pioche est épuisée (comparaison des cartes en main)

### Attribution des Pierres
Le gagnant de la manche remporte une Pierre d'Infinité.

## Cartes et Pouvoirs (Exemples Typiques)

> **Note** : Les cartes exactes et leurs effets sont détaillés dans le rulebook PDF officiel.

### Cartes de Faible Valeur (1-3)
- **Effets d'information** : Regarder la main d'un adversaire
- **Effets de protection** : Immunité jusqu'au prochain tour
- **Effets de comparaison** : Comparer les mains et éliminer

### Cartes de Valeur Moyenne (4-6)
- **Effets d'échange** : Échanger sa main avec un adversaire
- **Effets de pioche** : Piocher des cartes supplémentaires
- **Effets de défausse** : Forcer un adversaire à défausser

### Cartes de Haute Valeur (7-8)
- **Effets puissants** : Élimination directe d'adversaires
- **Conditions de victoire** : Gagner immédiatement sous certaines conditions

## Conditions de Victoire

### Victoire de Manche
- Être le dernier joueur en vie
- Avoir la carte de plus haute valeur si plusieurs survivent

### Victoire de Partie
Remporter le nombre requis de Pierres d'Infinité :
- **2 joueurs** : 7 Pierres
- **3 joueurs** : 5 Pierres  
- **4 joueurs** : 4 Pierres

## Stratégies de Base

### Gestion de l'Information
- Mémoriser les cartes jouées
- Déduire les cartes en main des adversaires
- Utiliser les effets d'information à bon escient

### Timing des Pouvoirs
- Jouer les cartes défensives au bon moment
- Coordonner les attaques contre les meneurs
- Conserver les cartes puissantes pour les moments critiques

### Psychologie
- Bluffer sur la force de sa main
- Analyser le comportement des adversaires
- Créer des alliances temporaires

## Variantes et Règles Optionnelles

### Mode Équipes
- Joueurs répartis en équipes
- Victoire partagée des coéquipiers
- Communication limitée entre coéquipiers

### Règles Avancées
- Cartes spéciales additionnelles
- Effets de combo entre certaines cartes
- Conditions de victoire alternatives

## Implémentation Numérique

### Adaptations pour le Jeu en Ligne

#### Interface Utilisateur
- **Main du joueur** : Cartes visibles uniquement par le joueur
- **Zone de jeu** : Cartes jouées visibles par tous
- **Historique** : Log des actions précédentes
- **Chat** : Communication entre joueurs

#### Automatisation
- **Distribution** : Mélange et distribution automatiques
- **Validation** : Vérification des actions légales
- **Résolution** : Application automatique des effets
- **Scoring** : Calcul automatique des scores

#### Anti-Triche
- **Validation serveur** : Toutes les actions validées côté serveur
- **Information cachée** : Les cartes privées restent secrètes
- **Timing** : Limites de temps pour les actions
- **Logs** : Enregistrement de toutes les actions

## États du Jeu

### États de Partie
```typescript
enum GameState {
  WAITING_PLAYERS = 'WAITING_PLAYERS',
  IN_PROGRESS = 'IN_PROGRESS',
  ROUND_END = 'ROUND_END',
  GAME_END = 'GAME_END'
}
```

### États de Tour
```typescript
enum TurnState {
  DRAW = 'DRAW',           // Pioche obligatoire
  PLAY = 'PLAY',           // Choix de la carte à jouer
  RESOLVE = 'RESOLVE',     // Résolution de l'effet
  NEXT_PLAYER = 'NEXT_PLAYER' // Passage au joueur suivant
}
```

## Gestion des Erreurs

### Erreurs Communes
- **Action illégale** : Jouer une carte non autorisée
- **Timing incorrect** : Action hors de son tour
- **Cible invalide** : Cibler un joueur éliminé
- **Déconnexion** : Perte de connexion en cours de partie

### Récupération
- **Reconnexion** : Restauration de l'état de jeu
- **IA temporaire** : Remplacement temporaire par IA
- **Pause** : Mise en pause en cas de problème technique

## Intégration avec le Système de Lobbies

### Transition Lobby → Partie
1. Vérification du nombre de joueurs (2-4)
2. Validation que tous les joueurs sont prêts
3. Initialisation de l'état de jeu
4. Distribution des cartes initiales
5. Démarrage du premier tour

### Fin de Partie
1. Calcul des scores finaux
2. Attribution des récompenses/statistiques
3. Retour au lobby ou nouvelle partie
4. Sauvegarde des résultats

Cette documentation fournit une vue d'ensemble du système de jeu. Pour les règles détaillées et officielles, consultez le [Infinity-Gauntlet-Rulebook.pdf](./Infinity-Gauntlet-Rulebook.pdf).

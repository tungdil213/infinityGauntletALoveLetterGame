# Guide de Développement

## Configuration de l'Environnement

### Prérequis

- **Node.js** : Version 18+ recommandée
- **pnpm** : Gestionnaire de paquets (recommandé)
- **PostgreSQL** : Base de données (version 12+)
- **Git** : Contrôle de version

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd infinityGauntletALoveLetterGame
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```

4. **Configurer les variables d'environnement**
   ```env
   # Base de données
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=infinity_gauntlet_db

   # Application
   APP_KEY=your_app_key_here
   HOST=localhost
   PORT=3333
   NODE_ENV=development

   # Session
   SESSION_DRIVER=cookie

   # Mail (optionnel pour développement)
   MAIL_MAILER=smtp
   ```

5. **Générer la clé d'application**
   ```bash
   node ace generate:key
   ```

6. **Migrations de base de données**
   ```bash
   node ace migration:run
   ```

7. **Seeding (optionnel)**
   ```bash
   node ace db:seed
   ```

## Scripts de Développement

### Commandes Principales

```bash
# Démarrage du serveur de développement
pnpm dev

# Build de production
pnpm build

# Démarrage en production
pnpm start

# Tests
pnpm test

# Linting
pnpm lint

# Formatage du code
pnpm format

# Vérification TypeScript
pnpm typecheck
```

### Commandes AdonisJS

```bash
# Créer une migration
node ace make:migration create_table_name

# Créer un modèle
node ace make:model ModelName

# Créer un contrôleur
node ace make:controller ControllerName

# Créer un middleware
node ace make:middleware MiddlewareName

# Créer un provider
node ace make:provider ProviderName

# Rollback de migrations
node ace migration:rollback

# Reset de la base de données
node ace migration:reset
```

## Structure du Code

### Organisation des Features

Chaque nouvelle feature doit suivre cette structure :

```
src/features/nouvelle-feature/
├── app/
│   ├── controllers/          # Contrôleurs HTTP
│   └── services/            # Use Cases
├── domain/
│   ├── entities/            # Entités métier
│   ├── repositories/        # Interfaces repositories
│   ├── services/           # Services domaine
│   ├── DTO/               # Data Transfer Objects
│   └── types/             # Types TypeScript
└── infrastructure/
    ├── repositories/       # Implémentations repositories
    └── routes/            # Définition des routes
```

### Conventions de Nommage

#### Fichiers et Dossiers
- **Dossiers** : `kebab-case` (ex: `lobby-system`)
- **Fichiers** : `snake_case` (ex: `list_lobbies_controller.ts`)
- **Classes** : `PascalCase` (ex: `ListLobbiesController`)
- **Interfaces** : `PascalCase` avec suffixe `Interface` (ex: `PlayerInterface`)

#### Base de Données
- **Tables** : `snake_case` au pluriel (ex: `users`, `game_sessions`)
- **Colonnes** : `snake_case` (ex: `created_at`, `user_id`)

### Patterns à Suivre

#### 1. Injection de Dépendances

```typescript
@inject()
export default class ExampleController {
  constructor(
    private exampleUseCase: ExampleUseCase,
    private anotherService: AnotherService
  ) {}
}
```

#### 2. Use Cases

```typescript
@inject()
export default class ExampleUseCase {
  constructor(private repository: ExampleRepository) {}

  async handle(input: ExampleInput): Promise<ExampleOutput> {
    // Logique métier
    const result = await this.repository.findSomething(input.id)
    return this.transformResult(result)
  }
}
```

#### 3. Repositories

```typescript
// Interface
export abstract class ExampleRepository {
  abstract findById(id: string): Promise<ExampleEntity>
  abstract save(entity: ExampleEntity): Promise<void>
}

// Implémentation
export class DatabaseExampleRepository extends ExampleRepository {
  async findById(id: string): Promise<ExampleEntity> {
    const model = await ExampleModel.findOrFail(id)
    return this.toDomainEntity(model)
  }
}
```

## Tests

### Structure des Tests

```
tests/
├── unit/              # Tests unitaires
├── functional/        # Tests fonctionnels (API)
└── browser/          # Tests end-to-end
```

### Écriture de Tests

#### Tests Unitaires

```typescript
import { test } from '@japa/runner'
import { ExampleService } from '#features/example/domain/services/example_service'

test.group('ExampleService', () => {
  test('should do something', async ({ assert }) => {
    const service = new ExampleService()
    const result = await service.doSomething()
    
    assert.equal(result.status, 'success')
  })
})
```

#### Tests Fonctionnels

```typescript
import { test } from '@japa/runner'

test.group('Lobbies API', (group) => {
  group.each.setup(async () => {
    // Setup avant chaque test
  })

  test('GET /lobby should return lobbies list', async ({ client }) => {
    const response = await client.get('/lobby')
    
    response.assertStatus(200)
    response.assertBodyContains({ lobbies: [] })
  })
})
```

### Exécution des Tests

```bash
# Tous les tests
pnpm test

# Tests spécifiques
node ace test --grep "ExampleService"

# Tests avec coverage
node ace test --coverage

# Tests en mode watch
node ace test --watch
```

## Base de Données

### Migrations

#### Créer une Migration

```bash
node ace make:migration create_example_table
```

#### Structure d'une Migration

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'examples'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').unique().notNullable()
      table.string('name').notNullable()
      table.enum('status', ['active', 'inactive']).defaultTo('active')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Modèles Lucid

```typescript
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Example extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => RelatedModel)
  declare relatedItems: HasMany<typeof RelatedModel>
}
```

## Frontend (React + Inertia)

### Structure des Composants

```
resources/
├── pages/             # Pages Inertia
├── components/        # Composants réutilisables
├── layouts/          # Layouts de page
├── lib/              # Utilitaires
└── css/              # Styles globaux
```

### Composant Type

```typescript
import { Head } from '@inertiajs/react'

interface ExamplePageProps {
  data: ExampleData[]
}

export default function ExamplePage({ data }: ExamplePageProps) {
  return (
    <>
      <Head title="Example Page" />
      
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Example</h1>
        
        <div className="grid gap-4">
          {data.map(item => (
            <div key={item.id} className="p-4 border rounded">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

### Utilisation d'Inertia

```typescript
// Dans un contrôleur
return inertia.render('example/index', {
  data: transformedData,
  meta: { title: 'Example Page' }
})

// Navigation côté client
import { router } from '@inertiajs/react'

router.visit('/example')
router.post('/example', formData)
```

## Debugging

### Logs

```typescript
// Utilisation du logger AdonisJS
import logger from '@adonisjs/core/services/logger'

logger.info('Information message')
logger.error('Error message', { error })
logger.debug('Debug message', { data })
```

### Debug en Développement

```typescript
// Variables d'environnement pour debug
NODE_ENV=development
LOG_LEVEL=debug

// Console.log temporaires (à supprimer avant commit)
console.log('Debug:', data)
```

### Outils de Debug

- **AdonisJS Debugger** : Intégré au framework
- **Browser DevTools** : Pour le frontend React
- **Database Query Logs** : Activés en développement

## Déploiement

### Build de Production

```bash
# Build de l'application
pnpm build

# Variables d'environnement de production
NODE_ENV=production
APP_KEY=your_production_key
DB_HOST=production_db_host
```

### Checklist Pré-Déploiement

- [ ] Tests passent
- [ ] Migrations appliquées
- [ ] Variables d'environnement configurées
- [ ] Build de production créé
- [ ] Logs de production configurés

## Contribution

### Workflow Git

1. **Créer une branche feature**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

2. **Développer et tester**
   ```bash
   # Développement...
   pnpm test
   pnpm lint
   ```

3. **Commit avec message descriptif**
   ```bash
   git commit -m "feat: ajouter système de notifications"
   ```

4. **Push et créer une Pull Request**
   ```bash
   git push origin feature/nouvelle-fonctionnalite
   ```

### Standards de Code

- **ESLint** : Configuration dans `.eslintrc.js`
- **Prettier** : Configuration dans `.prettierrc`
- **TypeScript** : Configuration dans `tsconfig.json`

### Messages de Commit

Format : `type(scope): description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

## Ressources

### Documentation
- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [React Documentation](https://react.dev/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Outils Utiles
- **VS Code Extensions** : AdonisJS, TypeScript, Tailwind CSS
- **Database Tools** : TablePlus, pgAdmin
- **API Testing** : Postman, Insomnia

Cette documentation couvre les aspects essentiels du développement sur ce projet. N'hésitez pas à la mettre à jour au fur et à mesure de l'évolution du projet.

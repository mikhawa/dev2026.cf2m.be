# architecture.md — Cartographie technique

Projet : **dev2026.cf2m.be**
Dernière mise à jour : 2026-02-24
Statut : **Opérationnel**

---

## 1. Vue d'ensemble

```
[Navigateur]
     |
     | HTTP (:8085)
     v
[Nginx] ──── fichiers statiques (public/)
     |
     | FastCGI (:9000)
     v
[PHP-FPM 8.4.18 / Symfony 7.4.5]
     |              |
     | Doctrine ORM | SMTP (:1025)
     v              v
[MariaDB 11.4]  [Mailpit]
```

---

## 2. Environnement Docker

| Service | Image | Port local → conteneur | Nom conteneur |
|---------|-------|------------------------|---------------|
| `php` | `php:8.4-fpm` (build custom) | — (FastCGI 9000 interne) | `cf2m_php` |
| `nginx` | `nginx:alpine` | 8085 → 80 | `cf2m_nginx` |
| `db` | `mariadb:11.4` | 3307 → 3306 | `cf2m_db` |
| `phpmyadmin` | `phpmyadmin:latest` | 8181 → 80 | `cf2m_phpmyadmin` |
| `mailpit` | `axllent/mailpit:latest` | 8025 → 8025 (UI), 1025 → 1025 (SMTP) | `cf2m_mailpit` |

Volumes :
- `.:/var/www/html` monté dans `php` et `nginx`
- `db_data:/var/lib/mysql` pour la persistance MariaDB

Base de données : `cf2m_db` / utilisateur `cf2m_user`

### 2.1 Image PHP custom (docker/php/Dockerfile)

Basée sur `php:8.4-fpm`, l'image inclut :

**Extensions PHP compilées :**
| Extension | Rôle |
|-----------|------|
| `pdo_mysql` | Connexion MariaDB via Doctrine |
| `intl` | Internationalisation (ICU) |
| `opcache` | Cache bytecode PHP |
| `gd` | Manipulation d'images (freetype + jpeg) |
| `zip` | Gestion d'archives ZIP |

**Extensions PECL :**
| Extension | Version | Rôle |
|-----------|---------|------|
| `xdebug` | 3.5.0 | Débogage et profiling |
| `apcu` | 5.1.28 | Cache mémoire utilisateur |

**Configuration Xdebug :**
- `xdebug.mode=develop,debug` — informations enrichies + step debugging
- `xdebug.client_host=host.docker.internal` — connexion vers l'IDE sur WSL2
- `xdebug.start_with_request=trigger` — activation via cookie/header `XDEBUG_TRIGGER`

**Configuration APCu :**
- `apc.enable_cli=1` — cache actif en CLI (commandes Symfony)

**Outils inclus :**
- Composer (dernière version, copiée depuis l'image officielle)
- Node.js 22 LTS + npm (pour Tailwind CSS CLI)

**Configuration PHP :**
- `upload_max_filesize = 10M`
- `post_max_size = 10M`

### 2.2 Configuration Nginx

Le fichier `docker/nginx/default.conf` configure :
- Document root : `/var/www/html/public`
- Front controller : `index.php` (Symfony)
- Toutes les requêtes non-fichier sont routées vers `index.php`
- Les fichiers `.php` hors front controller retournent 404

---

## 3. Structure du projet Symfony

```
dev2026.cf2m.be/
├── assets/
│   ├── app.js                # Point d'entrée JS (Stimulus + Turbo)
│   ├── bootstrap.js          # Initialisation Stimulus
│   └── styles/
│       └── app.css           # Point d'entrée CSS (Tailwind v4)
├── bin/
│   ├── console               # CLI Symfony
│   └── phpunit               # Lanceur de tests
├── config/
│   ├── packages/             # Configuration par bundle
│   │   ├── asset_mapper.yaml
│   │   ├── doctrine.yaml
│   │   ├── framework.yaml
│   │   ├── messenger.yaml
│   │   ├── monolog.yaml
│   │   ├── security.yaml
│   │   ├── tailwind.yaml
│   │   ├── twig.yaml
│   │   └── ...
│   ├── routes/               # Configuration des routes
│   ├── bundles.php
│   ├── preload.php
│   ├── routes.yaml
│   └── services.yaml
├── docker/
│   ├── nginx/
│   │   └── default.conf      # Configuration Nginx
│   └── php/
│       └── Dockerfile         # Image PHP custom
├── documentation/             # Documentation technique
│   ├── architecture.md        # Ce fichier
│   ├── journal-decisions.md   # Décisions techniques (ADR)
│   └── securite.md            # Audit de sécurité
├── public/
│   └── index.php              # Front controller
├── src/
│   ├── Controller/
│   │   └── AccueilController.php  # Page d'accueil (route /)
│   ├── Entity/
│   ├── Kernel.php
│   └── Repository/
├── templates/
│   ├── accueil/
│   │   ├── index.html.twig    # Page d'accueil
│   │   └── _hero.html.twig    # Section hero (partial)
│   └── base.html.twig         # Layout principal
├── tests/
├── translations/
├── var/                       # Cache, logs (gitignore)
├── vendor/                    # Dépendances (gitignore)
├── .env                       # Variables d'environnement
├── composer.json
├── docker-compose.yml
├── importmap.php              # Mapping JS (AssetMapper)
└── symfony.lock
```

---

## 4. Couches applicatives

### 4.1 Contrôleurs
- Minces : délégation vers services/repositories
- Pas de logique métier dans les contrôleurs
- Routes définies par attributs PHP (`#[Route]`)

**Routes actuelles :**
| Route | Contrôleur | Description |
|-------|-----------|-------------|
| `/` (`app_accueil`) | `AccueilController::index` | Page d'accueil |

### 4.2 Entités / Doctrine
- Attributs PHP 8.x pour le mapping
- Migrations versionnées
- Connexion MariaDB 11.4 via `DATABASE_URL`

### 4.3 Templates Twig
- Layout principal : `base.html.twig`
- Partials préfixés par `_` (ex: `_hero.html.twig`)
- Composants réutilisables via Twig Components (à venir)
- Pas de logique métier dans les templates

### 4.4 Frontend
- **AssetMapper** : pas de build step pour JS
- **Tailwind CSS 4.1.11** via `symfonycasts/tailwind-bundle` (compilation automatique)
- **Stimulus.js** pour l'interactivité JS
- **Symfony UX Turbo** pour la navigation SPA-like

### 4.5 Administration
- **EasyAdmin 4.x** : interface CRUD auto-générée (à installer)
- Accès restreint à `ROLE_ADMIN`

---

## 5. Stack technique — versions exactes

| Composant | Version |
|-----------|---------|
| PHP | 8.4.18 |
| Symfony | 7.4.5 (LTS, maintenu jusqu'à 11/2028) |
| MariaDB | 11.4 |
| Doctrine ORM | 3.6.2 |
| Tailwind CSS | 4.1.11 |
| Stimulus Bundle | 2.32.0 |
| UX Turbo | 2.32.0 |
| Xdebug | 3.5.0 |
| APCu | 5.1.28 |
| Node.js | 22 LTS |
| Nginx | alpine (latest) |
| Composer | latest |

---

## 6. Dépendances Composer principales

### Production (`require`)
| Paquet | Rôle |
|--------|------|
| `symfony/framework-bundle` 7.4.* | Socle Symfony |
| `doctrine/orm` ^3.6 | ORM |
| `doctrine/doctrine-bundle` ^3.2 | Intégration Doctrine/Symfony |
| `doctrine/doctrine-migrations-bundle` ^4.0 | Migrations BDD |
| `symfony/asset-mapper` 7.4.* | Gestion des assets sans build |
| `symfonycasts/tailwind-bundle` ^0.12 | Compilation Tailwind CSS |
| `symfony/twig-bundle` 7.4.* | Moteur de templates |
| `symfony/security-bundle` 7.4.* | Authentification et autorisation |
| `symfony/form` 7.4.* | Formulaires |
| `symfony/validator` 7.4.* | Validation |
| `symfony/mailer` 7.4.* | Envoi d'emails |
| `symfony/messenger` 7.4.* | Bus de messages |
| `symfony/stimulus-bundle` ^2.32 | Intégration Stimulus.js |
| `symfony/ux-turbo` ^2.32 | Navigation Turbo Drive |
| `symfony/serializer` 7.4.* | Sérialisation |
| `symfony/http-client` 7.4.* | Client HTTP |
| `twig/twig` ^3.0 | Moteur Twig |
| `twig/extra-bundle` ^3.0 | Extensions Twig |

### Développement (`require-dev`)
| Paquet | Rôle |
|--------|------|
| `phpunit/phpunit` ^13.0 | Tests unitaires et fonctionnels |
| `symfony/maker-bundle` ^1.0 | Générateur de code |
| `symfony/web-profiler-bundle` 7.4.* | Barre de debug |
| `symfony/debug-bundle` 7.4.* | Debug avancé |
| `symfony/browser-kit` 7.4.* | Tests HTTP |
| `symfony/stopwatch` 7.4.* | Mesure de performance |

---

## 7. URLs de développement

| Service | URL |
|---------|-----|
| Application | http://localhost:8085 |
| phpMyAdmin | http://localhost:8181 |
| Mailpit (interface mail) | http://localhost:8025 |
| Web Profiler | http://localhost:8085/_profiler |

---

## 8. Commandes utiles

```bash
# Démarrer l'environnement
docker compose up -d

# Arrêter l'environnement
docker compose down

# Rebuild de l'image PHP (après modification du Dockerfile)
docker compose build php && docker compose up -d

# Console Symfony
docker compose exec php php bin/console

# Compiler Tailwind CSS
docker compose exec php php bin/console tailwind:build

# Compiler Tailwind CSS (mode watch)
docker compose exec php php bin/console tailwind:build --watch

# Installer les dépendances Composer
docker compose exec php composer install

# Lancer les tests
docker compose exec php php bin/phpunit

# Linting
docker compose exec php php bin/console lint:twig templates/
docker compose exec php php bin/console lint:yaml config/
docker compose exec php php bin/console lint:container
```

---

## 9. Historique des mises à jour

| Date | Description |
|------|-------------|
| 2026-02-18 | Création du document (structure initiale) |
| 2026-02-19 | Installation Symfony 7.4.5, webapp, Tailwind CSS 4.1.11, Xdebug 3.5.0, APCu 5.1.28. Page d'accueil avec design glassmorphism |
| 2026-02-24 | Ajout du service Mailpit (interception mails en dev). MAILER_DSN pointe vers smtp://mailpit:1025 |

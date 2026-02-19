# architecture.md — Cartographie technique

Projet : **dev2026.cf2m.be**
Derniere mise a jour : 2026-02-19
Statut : **Operationnel**

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
     |
     | Doctrine ORM
     v
[MariaDB 11.4]
```

---

## 2. Environnement Docker

| Service | Image | Port local → conteneur | Nom conteneur |
|---------|-------|------------------------|---------------|
| `php` | `php:8.4-fpm` (build custom) | — (FastCGI 9000 interne) | `cf2m_php` |
| `nginx` | `nginx:alpine` | 8085 → 80 | `cf2m_nginx` |
| `db` | `mariadb:11.4` | 3306 → 3306 | `cf2m_db` |
| `phpmyadmin` | `phpmyadmin:latest` | 8181 → 80 | `cf2m_phpmyadmin` |

Volumes :
- `.:/var/www/html` monte dans `php` et `nginx`
- `db_data:/var/lib/mysql` pour la persistance MariaDB

Base de donnees : `cf2m_db` / utilisateur `cf2m_user`

### 2.1 Image PHP custom (docker/php/Dockerfile)

Basee sur `php:8.4-fpm`, l'image inclut :

**Extensions PHP compilees :**
| Extension | Role |
|-----------|------|
| `pdo_mysql` | Connexion MariaDB via Doctrine |
| `intl` | Internationalisation (ICU) |
| `opcache` | Cache bytecode PHP |
| `gd` | Manipulation d'images (freetype + jpeg) |
| `zip` | Gestion d'archives ZIP |

**Extensions PECL :**
| Extension | Version | Role |
|-----------|---------|------|
| `xdebug` | 3.5.0 | Debogage et profiling |
| `apcu` | 5.1.28 | Cache memoire utilisateur |

**Configuration Xdebug :**
- `xdebug.mode=develop,debug` — informations enrichies + step debugging
- `xdebug.client_host=host.docker.internal` — connexion vers l'IDE sur WSL2
- `xdebug.start_with_request=trigger` — activation via cookie/header `XDEBUG_TRIGGER`

**Configuration APCu :**
- `apc.enable_cli=1` — cache actif en CLI (commandes Symfony)

**Outils inclus :**
- Composer (derniere version, copiee depuis l'image officielle)
- Node.js 22 LTS + npm (pour Tailwind CSS CLI)

**Configuration PHP :**
- `upload_max_filesize = 10M`
- `post_max_size = 10M`

### 2.2 Configuration Nginx

Le fichier `docker/nginx/default.conf` configure :
- Document root : `/var/www/html/public`
- Front controller : `index.php` (Symfony)
- Toutes les requetes non-fichier sont routees vers `index.php`
- Les fichiers `.php` hors front controller retournent 404

---

## 3. Structure du projet Symfony

```
dev2026.cf2m.be/
├── assets/
│   ├── app.js                # Point d'entree JS (Stimulus + Turbo)
│   ├── bootstrap.js          # Initialisation Stimulus
│   └── styles/
│       └── app.css           # Point d'entree CSS (Tailwind v4)
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
│   ├── journal-decisions.md   # Decisions techniques (ADR)
│   └── securite.md            # Audit de securite
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
├── vendor/                    # Dependances (gitignore)
├── .env                       # Variables d'environnement
├── composer.json
├── docker-compose.yml
├── importmap.php              # Mapping JS (AssetMapper)
└── symfony.lock
```

---

## 4. Couches applicatives

### 4.1 Controleurs
- Minces : delegation vers services/repositories
- Pas de logique metier dans les controleurs
- Routes definies par attributs PHP (`#[Route]`)

**Routes actuelles :**
| Route | Controleur | Description |
|-------|-----------|-------------|
| `/` (`app_accueil`) | `AccueilController::index` | Page d'accueil |

### 4.2 Entites / Doctrine
- Attributs PHP 8.x pour le mapping
- Migrations versionnees
- Connexion MariaDB 11.4 via `DATABASE_URL`

### 4.3 Templates Twig
- Layout principal : `base.html.twig`
- Partials prefixes par `_` (ex: `_hero.html.twig`)
- Composants reutilisables via Twig Components (a venir)
- Pas de logique metier dans les templates

### 4.4 Frontend
- **AssetMapper** : pas de build step pour JS
- **Tailwind CSS 4.1.11** via `symfonycasts/tailwind-bundle` (compilation automatique)
- **Stimulus.js** pour l'interactivite JS
- **Symfony UX Turbo** pour la navigation SPA-like

### 4.5 Administration
- **EasyAdmin 4.x** : interface CRUD auto-generee (a installer)
- Acces restreint a `ROLE_ADMIN`

---

## 5. Stack technique — versions exactes

| Composant | Version |
|-----------|---------|
| PHP | 8.4.18 |
| Symfony | 7.4.5 (LTS, maintenu jusqu'a 11/2028) |
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

## 6. Dependances Composer principales

### Production (`require`)
| Paquet | Role |
|--------|------|
| `symfony/framework-bundle` 7.4.* | Socle Symfony |
| `doctrine/orm` ^3.6 | ORM |
| `doctrine/doctrine-bundle` ^3.2 | Integration Doctrine/Symfony |
| `doctrine/doctrine-migrations-bundle` ^4.0 | Migrations BDD |
| `symfony/asset-mapper` 7.4.* | Gestion des assets sans build |
| `symfonycasts/tailwind-bundle` ^0.12 | Compilation Tailwind CSS |
| `symfony/twig-bundle` 7.4.* | Moteur de templates |
| `symfony/security-bundle` 7.4.* | Authentification et autorisation |
| `symfony/form` 7.4.* | Formulaires |
| `symfony/validator` 7.4.* | Validation |
| `symfony/mailer` 7.4.* | Envoi d'emails |
| `symfony/messenger` 7.4.* | Bus de messages |
| `symfony/stimulus-bundle` ^2.32 | Integration Stimulus.js |
| `symfony/ux-turbo` ^2.32 | Navigation Turbo Drive |
| `symfony/serializer` 7.4.* | Serialisation |
| `symfony/http-client` 7.4.* | Client HTTP |
| `twig/twig` ^3.0 | Moteur Twig |
| `twig/extra-bundle` ^3.0 | Extensions Twig |

### Developpement (`require-dev`)
| Paquet | Role |
|--------|------|
| `phpunit/phpunit` ^13.0 | Tests unitaires et fonctionnels |
| `symfony/maker-bundle` ^1.0 | Generateur de code |
| `symfony/web-profiler-bundle` 7.4.* | Barre de debug |
| `symfony/debug-bundle` 7.4.* | Debug avance |
| `symfony/browser-kit` 7.4.* | Tests HTTP |
| `symfony/stopwatch` 7.4.* | Mesure de performance |

---

## 7. URLs de developpement

| Service | URL |
|---------|-----|
| Application | http://localhost:8085 |
| phpMyAdmin | http://localhost:8181 |
| Web Profiler | http://localhost:8085/_profiler |

---

## 8. Commandes utiles

```bash
# Demarrer l'environnement
docker compose up -d

# Arreter l'environnement
docker compose down

# Rebuild de l'image PHP (apres modification du Dockerfile)
docker compose build php && docker compose up -d

# Console Symfony
docker compose exec php php bin/console

# Compiler Tailwind CSS
docker compose exec php php bin/console tailwind:build

# Compiler Tailwind CSS (mode watch)
docker compose exec php php bin/console tailwind:build --watch

# Installer les dependances Composer
docker compose exec php composer install

# Lancer les tests
docker compose exec php php bin/phpunit

# Linting
docker compose exec php php bin/console lint:twig templates/
docker compose exec php php bin/console lint:yaml config/
docker compose exec php php bin/console lint:container
```

---

## 9. Historique des mises a jour

| Date | Description |
|------|-------------|
| 2026-02-18 | Creation du document (structure initiale) |
| 2026-02-19 | Installation Symfony 7.4.5, webapp, Tailwind CSS 4.1.11, Xdebug 3.5.0, APCu 5.1.28. Page d'accueil avec design glassmorphism |

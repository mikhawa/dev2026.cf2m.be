# CLAUDE.md (Instructions pour Claude)

Ce fichier Claude Code (claude.ai/code) est le guide pour le projet cf2m.be en mode développement.

## Langue du projet

Français bien orthographié pour le code, les commits, la documentation et les échanges.

## Vue d'ensemble

Application web backend pour dev2026.cf2m.be. Projet en cours d'initialisation — la stack et l'architecture seront précisées dans `PROJECT_SPEC.md` au démarrage effectif.

Le fichier `CLAUDE_MODEL.md` contient le modèle de travail complet (workflow, structure documentaire, checklist sécurité, pièges courants). Le consulter pour toute question méthodologique.

## Stack technique cible de développement

Basée sur le retour d'expérience du projet cv-mikhawa
- **version FPM servie par Nginx**
- **PHP 8.4.5.*** / **Symfony 7.4.* **
- **MariaDB v11.4.10** (Doctrine ORM)
- **PHPMYADMIN pour gérer la DB**
- **AssetMapper** for frontend assets (no Webpack Encore, no build step)
- **Tailwind CSS 4.x** (with importmap)
- **Stimulus.js** + **Symfony UX Turbo** + **Twig Components** + **ReactUX Components (ux-react)**
- **EasyAdmin 4.x** for admin interface
- **VichUploaderBundle** for image uploads
- **SunEditor** for WYSIWYG editor
- **Docker Compose** (environnement de dev)
- **OS hôte :** WSL2 (Linux sous Windows)

> Mettre à jour cette section dès que `composer.json` et `docker-compose.yml` sont créés.

## Commandes de vérification (dans Docker)

Exécuter dans l'ordre — corriger chaque étape avant de passer à la suivante :

```bash
# Validation du projet
composer validate --strict

# Linting
php bin/console lint:twig templates/
php bin/console lint:yaml config/
php bin/console lint:container

# Analyse statique
vendor/bin/phpstan analyse src --level=8

# Formatage
./vendor/bin/php-cs-fixer fix

# Tests
php bin/phpunit

# Audit sécurité
composer audit

# Schéma BDD
php bin/console doctrine:schema:validate
```

Si le projet tourne dans Docker, préfixer avec `docker compose exec php`.

## Structure documentaire

| Fichier | Rôle |
|---------|------|
| `CLAUDE.md` | Instructions pour Claude Code (ce fichier) |
| `CLAUDE_MODEL.md` | Modèle de travail complet (workflow, agents, pièges) |
| `PROJECT_SPEC.md` | Cahier des charges (à créer) |
| `documentation/architecture.md` | Cartographie technique (à créer) |
| `documentation/journal-decisions.md` | Décisions techniques (ADR, cumulatif) |
| `documentation/securite.md` | Audit de sécurité permanent |

## Règles de codage

| Interdit | Utiliser à la place |
|----------|---------------------|
| SQL brut concaténé | Requêtes Doctrine paramétrées |
| `|raw` sur contenu non assaini (Twig) | HtmlSanitizer puis `|raw` |
| Secrets en clair dans le code | Variables d'environnement (`.env.local`) |
| `createMock()` sans expectation | `createStub()` |
| Code abrégé (`...`, `// reste du code`) | Code complet, jamais tronqué |

## Conventions de commit

- Messages en français, concis
- Ne committer que sur demande explicite
- Ne jamais pousser sauf demande explicite
- Format : `git commit -m "description concise"``

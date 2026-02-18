# CLAUDE.md

Ce fichier Claude Code (claude.ai/code) est le guide pour le projet cf2m.be. 

## Langue du projet

Francais pour le code, les commits, la documentation et les échanges.

## Vue d'ensemble

Application web backend pour dev2026.cf2m.be. Projet en cours d'initialisation — la stack et l'architecture seront precisees dans `PROJECT_SPEC.md` au demarrage effectif.

Le fichier `CLAUDE_MODEL.md` contient le modele de travail complet (workflow, structure documentaire, checklist securite, pieges courants). Le consulter pour toute question methodologique.

## Stack technique cible

Basee sur le retour d'experience du projet cv-mikhawa 
- **version FPM servie par Nginx)
- **PHP 8.5** / **Symfony 8.* **
- **MariaDB v11.4.10** (Doctrine ORM)
- **PHPMYADMIN pour gérer la DB**
- **AssetMapper** for frontend assets (no Webpack Encore, no build step)
- **Tailwind CSS 4.x** (with importmap)
- **Stimulus.js** + **Symfony UX Turbo** + **Twig Components** + **ReactUX Components**
- **EasyAdmin 4.x** for admin interface
- **VichUploaderBundle** for image uploads
- **SunEditor** for WYSIWYG editor
- **Docker Compose** (environnement de dev)
- **OS hote :** WSL2 (Linux sous Windows)

> Mettre a jour cette section des que `composer.json` et `docker-compose.yml` sont crees.

## Commandes de verification (dans Docker)

Executer dans l'ordre — corriger chaque etape avant de passer a la suivante :

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

# Audit securite
composer audit

# Schema BDD
php bin/console doctrine:schema:validate
```

Si le projet tourne dans Docker, prefixer avec `docker compose exec php`.

## Structure documentaire

| Fichier | Role |
|---------|------|
| `CLAUDE.md` | Instructions pour Claude Code (ce fichier) |
| `CLAUDE_MODEL.md` | Modele de travail complet (workflow, agents, pieges) |
| `PROJECT_SPEC.md` | Cahier des charges (a creer) |
| `documentation/architecture.md` | Cartographie technique (a creer) |
| `documentation/journal-decisions.md` | Decisions techniques (ADR, cumulatif) |
| `documentation/securite.md` | Audit de securite permanent |

## Regles de codage

| Interdit | Utiliser a la place |
|----------|---------------------|
| SQL brut concatene | Requetes Doctrine parametrees |
| `|raw` sur contenu non assaini (Twig) | HtmlSanitizer puis `|raw` |
| Secrets en clair dans le code | Variables d'environnement (`.env.local`) |
| `createMock()` sans expectation | `createStub()` |
| Code abrege (`...`, `// reste du code`) | Code complet, jamais tronque |

## Conventions de commit

- Messages en francais, concis
- Ne committer que sur demande explicite
- Ne jamais pousser sauf demande explicite
- Format : `git commit -m "description concise"``

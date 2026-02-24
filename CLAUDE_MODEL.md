# CLAUDE_MODEL.md — Modèle de travail complet

Ce fichier définit le workflow, la structure documentaire, la checklist sécurité et les pièges courants pour le projet `dev2026.cf2m.be`.

---

## Workflow général

1. **Lire** `CLAUDE.md` et `PROJECT_SPEC.md` avant toute intervention
2. **Vérifier** l'état du dépôt (`git status`, `git log --oneline -5`)
3. **Planifier** les modifications avant de coder
4. **Coder** en respectant les règles de codage (cf. `CLAUDE.md`)
5. **Valider** avec les commandes de vérification dans l'ordre défini
6. **Committer** uniquement sur demande explicite, en français
7. **Mettre à jour** la documentation impactée (architecture, journal-decisions)

---

## Agents et rôles

| Agent | Rôle |
|-------|------|
| Claude Code (principal) | Implémentation, refactoring, debug |
| Claude Code (revue) | Relecture sécurité, qualité de code |

---

## Structure documentaire

| Fichier | Rôle | Statut |
|---------|------|--------|
| `CLAUDE.md` | Instructions Claude Code | Actif |
| `CLAUDE_MODEL.md` | Modèle de travail (ce fichier) | Actif |
| `PROJECT_SPEC.md` | Cahier des charges | À compléter |
| `documentation/architecture.md` | Cartographie technique | À compléter |
| `documentation/journal-decisions.md` | Décisions techniques (ADR) | Cumulatif |
| `documentation/securite.md` | Audit de sécurité permanent | Cumulatif |

---

## Checklist sécurité

À vérifier avant chaque commit significatif :

- [ ] Pas de secret ou credential en dur dans le code
- [ ] Pas de SQL brut concaténé (utiliser Doctrine + paramètres)
- [ ] Pas de `|raw` Twig sans passage par HtmlSanitizer
- [ ] Pas de `eval()`, `exec()` ou fonctions dangereuses non justifiées
- [ ] Variables d'environnement sensibles dans `.env.local` (non versionné)
- [ ] Entrées utilisateur validées et assainies côté serveur
- [ ] Dépendances auditées (`composer audit`)
- [ ] Permissions fichiers correctes (pas de 777)
- [ ] CSRF actif sur les formulaires Symfony
- [ ] Pas de debug actif en production (`APP_ENV=prod`)

---

## Pièges courants

### Symfony / Doctrine
- Oublier de vider le cache après modification de config : `php bin/console cache:clear`
- Créer une migration sans valider le schéma : toujours lancer `doctrine:schema:validate`
- Utiliser `findAll()` sur une table volumineuse : préférer la pagination (Doctrine Paginator)
- Injecter le `EntityManager` directement dans un controller : préférer les Repositories

### Twig / Frontend
- Utiliser `|raw` sans assainissement préalable : risque XSS
- Oublier `{% block %}` dans les templates enfants
- Mélanger logique métier et affichage dans les templates

### Docker / Environnement
- Exécuter les commandes Symfony hors du conteneur : préfixer `docker compose exec php`
- Modifier `.env` au lieu de `.env.local` pour les secrets locaux
- Ne pas rebuilder l'image après modification du `Dockerfile` : `docker compose build`

### Tests
- Utiliser `createMock()` sans définir d'expectations : utiliser `createStub()`
- Tester avec la base de données de production : utiliser une DB de test dédiée
- Oublier de réinitialiser les fixtures entre les tests

### Git
- Committer des fichiers de debug ou de configuration locale
- Écrire des messages de commit en anglais (projet en français)
- Pousser sans demande explicite

---

## Commandes utiles (rappel)

```bash
# Dans le conteneur Docker
docker compose exec php bash

# Cache
php bin/console cache:clear
php bin/console cache:warmup

# Migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate

# Debug routes
php bin/console debug:router

# Debug conteneur de services
php bin/console debug:container

# Faire tourner les tests
php bin/phpunit --testdox
```

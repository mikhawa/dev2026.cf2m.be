# CLAUDE_MODEL.md — Modele de travail complet

Ce fichier definit le workflow, la structure documentaire, la checklist securite et les pieges courants pour le projet `dev2026.cf2m.be`.

---

## Workflow general

1. **Lire** `CLAUDE.md` et `PROJECT_SPEC.md` avant toute intervention
2. **Verifier** l'etat du depot (`git status`, `git log --oneline -5`)
3. **Planifier** les modifications avant de coder
4. **Coder** en respectant les regles de codage (cf. `CLAUDE.md`)
5. **Valider** avec les commandes de verification dans l'ordre defini
6. **Committer** uniquement sur demande explicite, en francais
7. **Mettre a jour** la documentation impactee (architecture, journal-decisions)

---

## Agents et roles

| Agent | Role |
|-------|------|
| Claude Code (principal) | Implementation, refactoring, debug |
| Claude Code (revue) | Relecture securite, qualite de code |

---

## Structure documentaire

| Fichier | Role | Statut |
|---------|------|--------|
| `CLAUDE.md` | Instructions Claude Code | Actif |
| `CLAUDE_MODEL.md` | Modele de travail (ce fichier) | Actif |
| `PROJECT_SPEC.md` | Cahier des charges | A completer |
| `documentation/architecture.md` | Cartographie technique | A completer |
| `documentation/journal-decisions.md` | Decisions techniques (ADR) | Cumulatif |
| `documentation/securite.md` | Audit de securite permanent | Cumulatif |

---

## Checklist securite

A verifier avant chaque commit significatif :

- [ ] Pas de secret ou credential en dur dans le code
- [ ] Pas de SQL brut concatene (utiliser Doctrine + parametres)
- [ ] Pas de `|raw` Twig sans passage par HtmlSanitizer
- [ ] Pas de `eval()`, `exec()` ou fonctions dangereuses non justifiees
- [ ] Variables d'environnement sensibles dans `.env.local` (non versionne)
- [ ] Entrees utilisateur validees et assainies cote serveur
- [ ] Dependances auditees (`composer audit`)
- [ ] Permissions fichiers correctes (pas de 777)
- [ ] CSRF actif sur les formulaires Symfony
- [ ] Pas de debug actif en production (`APP_ENV=prod`)

---

## Pieges courants

### Symfony / Doctrine
- Oublier de vider le cache apres modification de config : `php bin/console cache:clear`
- Creer une migration sans valider le schema : toujours lancer `doctrine:schema:validate`
- Utiliser `findAll()` sur une table volumineuse : preferer la pagination (Doctrine Paginator)
- Injecter le `EntityManager` directement dans un controller : preferer les Repositories

### Twig / Frontend
- Utiliser `|raw` sans assainissement prealable : risque XSS
- Oublier `{% block %}` dans les templates enfants
- Melanger logique metier et affichage dans les templates

### Docker / Environnement
- Executer les commandes Symfony hors du conteneur : prefixer `docker compose exec php`
- Modifier `.env` au lieu de `.env.local` pour les secrets locaux
- Ne pas rebuilder l'image apres modification du `Dockerfile` : `docker compose build`

### Tests
- Utiliser `createMock()` sans definir d'expectations : utiliser `createStub()`
- Tester avec la base de donnees de production : utiliser une DB de test dediee
- Oublier de reinitialiser les fixtures entre les tests

### Git
- Committer des fichiers de debug ou de configuration locale
- Ecrire des messages de commit en anglais (projet en francais)
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

# journal-decisions.md — Journal des decisions techniques (ADR)

Projet : **dev2026.cf2m.be**
Format : Architecture Decision Record (ADR) — document cumulatif
Derniere mise a jour : 2026-02-19

---

## Comment utiliser ce journal

Chaque decision technique significative est consignee ici sous forme d'ADR :
- **Contexte** : pourquoi cette decision a ete necessaire
- **Decision** : ce qui a ete choisi
- **Consequences** : impacts positifs et negatifs

Ajouter une entree pour toute decision qui :
- change la stack ou une dependance majeure
- modifie l'architecture ou la structure du projet
- introduit une contrainte ou une convention nouvelle

---

## ADR-001 — Choix de la stack technique

**Date :** 2026-02-18
**Statut :** Accepte

### Contexte
Initialisation du projet dev2026.cf2m.be. Besoin d'une stack eprouvee, maintenable et alignee avec le retour d'experience du projet cv-mikhawa.

### Decision
- PHP 8.4 / Symfony 7.4 LTS
- MariaDB 11.4 avec Doctrine ORM 3.6
- AssetMapper (pas de Webpack Encore, pas de build step)
- Tailwind CSS 4.x via `symfonycasts/tailwind-bundle`
- Stimulus.js + Symfony UX Turbo
- EasyAdmin 4.x pour l'administration
- Docker Compose pour l'environnement de developpement

### Consequences
- **+** Stack coherente avec les projets precedents, courbe d'apprentissage reduite
- **+** Pas de build step front (AssetMapper), simplicite accrue
- **+** Symfony 7.4 LTS : support long terme jusqu'a 11/2029
- **-** Tailwind CSS 4.x avec AssetMapper : configuration specifique via le bundle symfonycasts

---

## ADR-002 — Langue du projet

**Date :** 2026-02-18
**Statut :** Accepte

### Contexte
Projet developpe par une equipe francophone. Besoin d'une langue unique pour eviter les incoherences.

### Decision
Tout le projet (code metier, commits, documentation, commentaires, messages d'erreur) est en francais.

### Consequences
- **+** Coherence et lisibilite pour l'equipe
- **-** Friction potentielle avec des outils ou librairies en anglais (noms de methodes Symfony, etc.)

---

## ADR-003 — Installation Symfony et page d'accueil glassmorphism

**Date :** 2026-02-19
**Statut :** Accepte

### Contexte
L'infrastructure Docker etant operationnelle (4 services), il fallait installer le framework Symfony et mettre en place la premiere page visible du site avec le design fourni par le designer.

### Decision
- Installation de Symfony 7.4.5 via `composer create-project symfony/skeleton:"7.4.*"`
- Installation du pack `webapp` (Twig, Doctrine, Security, Mailer, AssetMapper, Stimulus, Turbo)
- Tailwind CSS 4.1.11 via `symfonycasts/tailwind-bundle` (compilation par le binaire Tailwind, sans Node.js cote build)
- Suppression du service PostgreSQL ajoute automatiquement par la recette Doctrine (on utilise MariaDB)
- Suppression du fichier `compose.override.yaml` genere par les recettes (conflictuel avec notre config)
- Design glassmorphism pour la page d'accueil : fond bleu fonce, navigation semi-transparente, carte chiffres cles avec backdrop-blur

### Consequences
- **+** Application Symfony fonctionnelle accessible sur http://localhost:8085
- **+** Tailwind CSS 4 compile automatiquement via la commande `tailwind:build`
- **+** Page d'accueil fidele au design du designer (header, hero, chiffres cles, CTA)
- **-** Les images (fond hero, portrait, logo) sont des placeholders a remplacer par les vrais assets

---

## ADR-004 — Activation de Xdebug et APCu

**Date :** 2026-02-19
**Statut :** Accepte

### Contexte
L'image PHP custom ne disposait ni de debogueur ni de cache memoire utilisateur. Xdebug est essentiel pour le debug pas a pas dans l'IDE, et APCu ameliore les performances en developpement.

### Decision
- Installation de Xdebug 3.5.0 et APCu 5.1.28 via PECL dans le Dockerfile
- Xdebug configure en mode `develop,debug` avec `start_with_request=trigger` (activation a la demande via cookie/header)
- Connexion Xdebug vers `host.docker.internal` (compatible WSL2)
- APCu active en CLI (`apc.enable_cli=1`) pour le cache des commandes Symfony

### Consequences
- **+** Debug pas a pas disponible dans l'IDE (PhpStorm, VS Code) via le trigger `XDEBUG_TRIGGER`
- **+** Informations de debug enrichies en mode develop (meilleurs var_dump, stack traces)
- **+** Cache APCu disponible pour Symfony (sessions, metadata Doctrine en dev)
- **-** Xdebug ralentit legerement l'execution meme en mode trigger (impact minimal en dev)
- **-** L'image Docker est plus volumineuse (~30 Mo supplementaires)

---

<!-- Ajouter les prochaines decisions ci-dessous en suivant le meme format -->

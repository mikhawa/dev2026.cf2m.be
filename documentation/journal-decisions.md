# journal-decisions.md — Journal des décisions techniques (ADR)

Projet : **dev2026.cf2m.be**
Format : Architecture Decision Record (ADR) — document cumulatif
Dernière mise à jour : 2026-02-24

---

## Comment utiliser ce journal

Chaque décision technique significative est consignée ici sous forme d'ADR :
- **Contexte** : pourquoi cette décision a été nécessaire
- **Décision** : ce qui a été choisi
- **Conséquences** : impacts positifs et négatifs

Ajouter une entrée pour toute décision qui :
- change la stack ou une dépendance majeure
- modifie l'architecture ou la structure du projet
- introduit une contrainte ou une convention nouvelle

---

## ADR-001 — Choix de la stack technique

**Date :** 2026-02-18
**Statut :** Accepté

### Contexte
Initialisation du projet dev2026.cf2m.be. Besoin d'une stack éprouvée, maintenable et alignée avec le retour d'expérience du projet cv-mikhawa.

### Décision
- PHP 8.4 / Symfony 7.4 LTS
- MariaDB 11.4 avec Doctrine ORM 3.6
- AssetMapper (pas de Webpack Encore, pas de build step)
- Tailwind CSS 4.x via `symfonycasts/tailwind-bundle`
- Stimulus.js + Symfony UX Turbo
- EasyAdmin 4.x pour l'administration
- Docker Compose pour l'environnement de développement

### Conséquences
- **+** Stack cohérente avec les projets précédents, courbe d'apprentissage réduite
- **+** Pas de build step front (AssetMapper), simplicité accrue
- **+** Symfony 7.4 LTS : support long terme jusqu'à 11/2029
- **-** Tailwind CSS 4.x avec AssetMapper : configuration spécifique via le bundle symfonycasts

---

## ADR-002 — Langue du projet

**Date :** 2026-02-18
**Statut :** Accepté

### Contexte
Projet développé par une équipe francophone. Besoin d'une langue unique pour éviter les incohérences.

### Décision
Tout le projet (code métier, commits, documentation, commentaires, messages d'erreur) est en français.

### Conséquences
- **+** Cohérence et lisibilité pour l'équipe
- **-** Friction potentielle avec des outils ou librairies en anglais (noms de méthodes Symfony, etc.)

---

## ADR-003 — Installation Symfony et page d'accueil glassmorphism

**Date :** 2026-02-19
**Statut :** Accepté

### Contexte
L'infrastructure Docker étant opérationnelle (4 services), il fallait installer le framework Symfony et mettre en place la première page visible du site avec le design fourni par le designer.

### Décision
- Installation de Symfony 7.4.5 via `composer create-project symfony/skeleton:"7.4.*"`
- Installation du pack `webapp` (Twig, Doctrine, Security, Mailer, AssetMapper, Stimulus, Turbo)
- Tailwind CSS 4.1.11 via `symfonycasts/tailwind-bundle` (compilation par le binaire Tailwind, sans Node.js côté build)
- Suppression du service PostgreSQL ajouté automatiquement par la recette Doctrine (on utilise MariaDB)
- Suppression du fichier `compose.override.yaml` généré par les recettes (conflictuel avec notre config)
- Design glassmorphism pour la page d'accueil : fond bleu foncé, navigation semi-transparente, carte chiffres clés avec backdrop-blur

### Conséquences
- **+** Application Symfony fonctionnelle accessible sur http://localhost:8085
- **+** Tailwind CSS 4 compilé automatiquement via la commande `tailwind:build`
- **+** Page d'accueil fidèle au design du designer (header, hero, chiffres clés, CTA)
- **-** Les images (fond hero, portrait, logo) sont des placeholders à remplacer par les vrais assets

---

## ADR-004 — Activation de Xdebug et APCu

**Date :** 2026-02-19
**Statut :** Accepté

### Contexte
L'image PHP custom ne disposait ni de débogueur ni de cache mémoire utilisateur. Xdebug est essentiel pour le debug pas à pas dans l'IDE, et APCu améliore les performances en développement.

### Décision
- Installation de Xdebug 3.5.0 et APCu 5.1.28 via PECL dans le Dockerfile
- Xdebug configuré en mode `develop,debug` avec `start_with_request=trigger` (activation à la demande via cookie/header)
- Connexion Xdebug vers `host.docker.internal` (compatible WSL2)
- APCu activé en CLI (`apc.enable_cli=1`) pour le cache des commandes Symfony

### Conséquences
- **+** Debug pas à pas disponible dans l'IDE (PhpStorm, VS Code) via le trigger `XDEBUG_TRIGGER`
- **+** Informations de debug enrichies en mode develop (meilleurs var_dump, stack traces)
- **+** Cache APCu disponible pour Symfony (sessions, metadata Doctrine en dev)
- **-** Xdebug ralentit légèrement l'exécution même en mode trigger (impact minimal en dev)
- **-** L'image Docker est plus volumineuse (~30 Mo supplémentaires)

---

## ADR-005 — Ajout de Mailpit pour l'interception des emails en développement

**Date :** 2026-02-24
**Statut :** Accepté

### Contexte
Le projet utilise `symfony/mailer` pour l'envoi d'emails. En développement, le DSN était configuré sur `null://null`, ce qui rendait impossible la vérification du rendu et du contenu des emails envoyés par l'application.

### Décision
- Ajout du service `axllent/mailpit:latest` dans `docker-compose.yml`
- Port SMTP interne : `1025` (accessible depuis le conteneur `php` via `mailpit:1025`)
- Port UI web : `8025` (accessible depuis l'hôte via http://localhost:8025)
- `MAILER_DSN` mis à jour dans `.env` : `smtp://mailpit:1025`
- Variables d'environnement Mailpit : `MP_SMTP_AUTH_ACCEPT_ANY=1` et `MP_SMTP_AUTH_ALLOW_INSECURE=1` pour accepter toute connexion SMTP sans TLS en dev
- Service `mailpit` ajouté dans les `depends_on` du conteneur `php`

### Conséquences
- **+** Tous les emails envoyés par Symfony sont interceptés et visibles dans l'UI Mailpit (http://localhost:8025)
- **+** Aucun email n'est réellement envoyé en développement — zéro risque d'envoi accidentel
- **+** Interface web simple : liste, aperçu HTML/texte, en-têtes SMTP
- **+** Pas de compte SMTP externe requis en dev
- **-** Un service Docker supplémentaire à démarrer (impact négligeable)

---

<!-- Ajouter les prochaines décisions ci-dessous en suivant le même format -->

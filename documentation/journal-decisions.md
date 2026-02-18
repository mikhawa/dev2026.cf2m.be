# journal-decisions.md — Journal des decisions techniques (ADR)

Projet : **dev2026.cf2m.be**
Format : Architecture Decision Record (ADR) — document cumulatif
Derniere mise a jour : 2026-02-18

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
- PHP 8.5 / Symfony 8.*
- MariaDB 11.4.10 avec Doctrine ORM
- AssetMapper (pas de Webpack Encore, pas de build step)
- Tailwind CSS 4.x via importmap
- Stimulus.js + Symfony UX Turbo
- EasyAdmin 4.x pour l'administration
- Docker Compose pour l'environnement de developpement

### Consequences
- **+** Stack coherente avec les projets precedents, courbe d'apprentissage reduite
- **+** Pas de build step front (AssetMapper), simplicite accrue
- **-** PHP 8.5 et Symfony 8.* sont recents, la documentation peut etre incomplete sur certains points
- **-** Tailwind CSS 4.x avec importmap : configuration non standard, peut necessiter des ajustements

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

<!-- Ajouter les prochaines decisions ci-dessous en suivant le meme format -->

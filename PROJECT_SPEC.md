# PROJECT_SPEC.md — Cahier des charges

Projet : **dev2026.cf2m.be**
Date de creation : 2026-02-18
Statut : **A completer**

---

## 1. Contexte et objectifs

> _Decrire ici le contexte du projet, le public cible et les objectifs principaux._

- **Contexte :** ...
- **Public cible :** ...
- **Objectifs :** ...

---

## 2. Perimetre fonctionnel

### 2.1 Fonctionnalites principales

> _Lister les grandes fonctionnalites attendues._

- [ ] ...
- [ ] ...

### 2.2 Fonctionnalites hors perimetre (v1)

- ...

---

## 3. Contraintes techniques

| Contrainte | Valeur |
|------------|--------|
| PHP | 8.5 |
| Symfony | 8.* |
| MariaDB | 11.4.10 |
| Environnement dev | Docker Compose / WSL2 |
| Environnement prod | A preciser |

---

## 4. Roles et permissions

> _Decrire les profils utilisateurs et leurs droits._

| Role | Acces |
|------|-------|
| `ROLE_ADMIN` | Acces complet (EasyAdmin) |
| `ROLE_USER` | A definir |
| Anonyme | A definir |

---

## 5. Modele de donnees (ebauche)

> _Lister les entites principales et leurs relations._

- **Entite 1** : ...
- **Entite 2** : ...

---

## 6. Interfaces et UX

> _Decrire les ecrans principaux, les maquettes ou les parcours utilisateurs._

- ...

---

## 7. Criteres d'acceptance

> _Conditions pour considerer le projet livrable._

- [ ] Toutes les commandes de verification passent sans erreur
- [ ] Tests unitaires et fonctionnels couvrent les cas metier principaux
- [ ] Audit securite (`composer audit`) sans vulnerabilite critique
- [ ] Documentation a jour (architecture, journal-decisions)
- [ ] ...

---

## 8. Historique des versions

| Version | Date | Description |
|---------|------|-------------|
| 0.1 | 2026-02-18 | Creation du cahier des charges |

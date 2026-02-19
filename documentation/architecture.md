# architecture.md — Cartographie technique

Projet : **dev2026.cf2m.be**
Derniere mise a jour : 2026-02-18
Statut : **A completer**

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
[PHP-FPM 8.4 / Symfony 7.4]
     |
     | Doctrine ORM
     v
[MariaDB 11.4]
```

---

## 2. Environnement Docker

| Service | Image | Port local → conteneur |
|---------|-------|------------------------|
| `php` | `php:8.4-fpm` (build custom) | — (FastCGI 9000 interne) |
| `nginx` | `nginx:alpine` | 8085 → 80 |
| `db` | `mariadb:11.4` | 3306 → 3306 |
| `phpmyadmin` | `phpmyadmin:latest` | 8181 → 80 |

Volumes :
- `.:/var/www/html` monte dans `php` et `nginx`
- `db_data:/var/lib/mysql` pour la persistance MariaDB

Base de donnees : `cf2m_db` / utilisateur `cf2m_user`

---

## 3. Structure du projet Symfony

```
dev2026.cf2m.be/
├── assets/              # AssetMapper (JS, CSS)
├── bin/
├── config/
│   ├── packages/
│   └── routes/
├── documentation/       # Documentation technique
├── migrations/          # Migrations Doctrine
├── public/              # Point d'entree web (index.php)
├── src/
│   ├── Controller/
│   ├── Entity/
│   ├── Form/
│   ├── Repository/
│   └── Security/
├── templates/           # Twig
├── tests/
├── translations/
├── var/                 # Cache, logs
└── vendor/
```

---

## 4. Couches applicatives

### 4.1 Controleurs
- Minces : delegation vers services/repositories
- Pas de logique metier dans les controleurs

### 4.2 Entites / Doctrine
- Annotations ou attributs PHP 8.x
- Migrations versionnees

### 4.3 Templates Twig
- Layouts : `base.html.twig`
- Composants reutilisables via Twig Components
- Pas de logique metier dans les templates

### 4.4 Frontend
- **AssetMapper** : pas de build step
- **Tailwind CSS 4.x** via importmap
- **Stimulus.js** pour l'interactivite JS
- **Symfony UX Turbo** pour la navigation SPA-like

### 4.5 Administration
- **EasyAdmin 4.x** : interface CRUD auto-generee
- Acces restreint a `ROLE_ADMIN`

---

## 5. Flux de donnees principaux

> _A completer au fur et a mesure de l'implementation._

| Flux | Description |
|------|-------------|
| ... | ... |

---

## 6. Dependances externes

> _A completer des que `composer.json` est stabilise._

| Paquet | Role |
|--------|------|
| `symfony/framework-bundle` | Socle Symfony |
| `doctrine/orm` | ORM |
| `easycorp/easyadmin-bundle` | Administration |
| `vich/uploader-bundle` | Upload de fichiers |
| `symfony/ux-turbo` | Turbo Drive/Frames |
| `symfony/ux-twig-component` | Composants Twig |

---

## 7. Historique des mises a jour

| Date | Description |
|------|-------------|
| 2026-02-18 | Creation du document (structure initiale) |
| 2026-02-19 | Mise a jour section 2 : versions et ports corriges apres creation docker-compose.yml |

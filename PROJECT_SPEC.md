# PROJECT_SPEC.md — Cahier des charges

Projet : **dev2026.cf2m.be**
Date de création : 2026-02-18
Statut : **En cours de rédaction**

---

Refonte du site existant [cf2m.be](https://www.cf2m.be) (Symfony 5.4) vers Symfony 7.4 LTS --webapp / Tailwind CSS 4.

## 1. Contexte et objectifs

- **Contexte :** Le CF2M (Centre de Formation 2 Mille) est un centre de formation professionnelle aux métiers du numérique situé à Saint-Gilles (Bruxelles). Le site actuel tourne sous Symfony 5.4 et nécessite une refonte technique et visuelle complète.
- **Public cible :** Chercheurs et chercheuses d'emploi à Bruxelles, partenaires institutionnels (Actiris, Bruxelles-Formation, etc.), équipe pédagogique.
- **Objectifs :**
  - Moderniser la stack technique (Symfony 7, PHP 8.4, Tailwind 4)
  - Refonte visuelle totale en **glassmorphism**
  - Rendre le contenu administrable via EasyAdmin (formations, partenaires, vidéo)
  - Gestion des rôles : admin complet + utilisateurs avec droits limités

---

## 2. Périmètre fonctionnel

### 2.1 Fonctionnalités principales

- [x] **Page d'accueil** avec sections :
  - [ ] Hero : titre + 2 CTA (Nos formations / Contactez-nous)
  - [ ] Présentation du CF2M (texte éditable)
  - [ ] Liste des formations (dynamique, ajout possible via admin)
  - [ ] Avantages (4 points clés, éditables)
  - [ ] Partenaires (logos uploadés et redimensionnés via admin)
  - [ ] Vidéo promotionnelle (embed configurable)
- [ ] **Page Formations** : liste + détail de chaque formation
- [ ] **Page Contact** : formulaire de contact fonctionnel (envoi email)
- [ ] **Gestion des partenaires** : CRUD admin + upload/redimensionnement de logos (VichUploader)
- [ ] **Gestion des formations** : CRUD admin, ajout/modification/suppression
- [ ] **Ajout d'un formulaire de préinscriptions pour les formations ouvertes**
- [ ] **Tracking analytique** : Matomo + Facebook Pixel
- [ ] **Espace administration** (EasyAdmin) : gestion complète du contenu
- [ ] **Gestion des utilisateurs** : admin + utilisateurs avec permissions partielles

### 2.2 Fonctionnalités hors périmètre (v1)

- Blog (supprimé)
- Page RGPD (supprimée)
- Témoignages (reporté, à voir plus tard)

---

## 3. Contraintes techniques

| Contrainte | Valeur |
|------------|--------|
| PHP | 8.4.5 |
| Symfony | 7.4 LTS (--webapp) |
| MariaDB | 11.4.10 |
| CSS | Tailwind CSS 4.x (glassmorphism) |
| Frontend | AssetMapper + Stimulus + Turbo |
| Admin | EasyAdmin 4.x |
| Upload images | VichUploaderBundle (redimensionnement logos) |
| Éditeur WYSIWYG | SunEditor |
| Environnement dev | Docker Compose / WSL2 |
| Environnement prod | À préciser |

---

## 4. Rôles et permissions

| Rôle | Accès |
|------|-------|
| `ROLE_ADMIN` | Accès complet : tout modifier via EasyAdmin |
| `ROLE_USER` | Ajout/modification de travaux d'élèves dans leur section de formation |
| Anonyme | Consultation du site public (accueil, formations, contact) |

---

## 5. Modèle de données (ébauche)

- **User** : id, email, password, roles

avec comme exemple :
```php
<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
// utilisation des contraintes de validation
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(options: ['unsigned' => true])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank(message: 'L\'email ne peut pas être vide.')]
    #[Assert\Email(message: 'L\'email "{{ value }}" n\'est pas une adresse email valide.')]
    private ?string $email = null;

    /** @var list<string> */
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le mot de passe ne peut pas être vide.')]
    #[Assert\Length(
        min: 8,
        max: 255,
        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.'
    )]
    private ?string $password = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'Le nom d\'utilisateur ne peut pas être vide.')]
    #[Assert\Length(
        min: 3,
        max: 50,
        minMessage: 'Le nom d\'utilisateur doit contenir au moins {{ limit }} caractères.', maxMessage: 'Le nom d\'utilisateur ne peut pas dépasser {{ limit }} caractères.'
    )]
    #[Assert\Regex(
        pattern: '/^[a-zA-Z0-9_]+$/',
        message: 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores.'
    )]
    private ?string $userName = null;

    // Getters et setters...
}
```

- **Formation** : id, titre, description, icône/image, slug, position (ordre d'affichage), active
- **Partenaire** : id, nom, logo (upload + redimensionnement 300x200px), url, position, active
- **PageContent** : id, section (hero, presentation, avantages...), contenu (JSON ou texte), updatedAt
- **PreInscription** : id, formation (ManyToOne), nom, prenom, email, telephone, message, createdAt
- **Contact** : id, nom, email, sujet, message, createdAt (historique des messages reçus) — envoi vers administration@cf2m.be
- **TravailEleve** : id, titre, description, image/fichier, user (ManyToOne), formation (ManyToOne), createdAt

---

## 6. Interfaces et UX

### Design : Glassmorphism

- Fond avec dégradé ou image floue
- Cartes semi-transparentes avec `backdrop-filter: blur()` et bordures subtiles
- Effets de verre sur les sections principales (hero, formations, partenaires)
- Palette de couleurs basée sur les tons du logo CF2M

### Pages principales

| Page | Description |
|------|-------------|
| Accueil | Hero + présentation + formations + avantages + partenaires + vidéo |
| Formations | Liste des formations avec fiches détaillées |
| Contact | Formulaire (nom, email, sujet, message) — envoi vers administration@cf2m.be |
| Pré-inscription | Formulaire lié à une formation ouverte |
| Travaux d'élèves | Section par formation, gérée par les ROLE_USER |
| Admin | EasyAdmin : CRUD formations, partenaires, contenu, utilisateurs |

---

## 7. Critères d'acceptance

- [ ] Toutes les commandes de vérification passent sans erreur
- [ ] Tests unitaires et fonctionnels couvrent les cas métier principaux
- [ ] Audit sécurité (`composer audit`) sans vulnérabilité critique
- [ ] Documentation à jour (architecture, journal-decisions)
- [ ] Design glassmorphism cohérent sur toutes les pages
- [ ] Upload et redimensionnement des logos partenaires fonctionnel
- [ ] Formulaire de contact opérationnel (envoi email)
- [ ] Formations administrables (ajout/modification/suppression)
- [ ] Tracking Matomo + Facebook Pixel intégré
- [ ] Formulaire de pré-inscription fonctionnel
- [ ] Travaux d'élèves : ajout par les utilisateurs ROLE_USER

---

## 8. Historique des versions

| Version | Date | Description |
|---------|------|-------------|
| 0.1 | 2026-02-18 | Création du cahier des charges |
| 0.2 | 2026-02-19 | Rédaction complète basée sur l'analyse du site existant |
| 0.3 | 2026-02-19 | Ajout pré-inscriptions, travaux d'élèves, précision rôles/logos/contact |

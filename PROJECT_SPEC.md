# PROJECT_SPEC.md — Cahier des charges

Projet : **dev2026.cf2m.be**
Date de creation : 2026-02-18
Statut : **En cours de redaction**

---

Refonte du site existant [cf2m.be](https://www.cf2m.be) (Symfony 5.4) vers Symfony 7.4 LTS --webapp / Tailwind CSS 4.

## 1. Contexte et objectifs

- **Contexte :** Le CF2M (Centre de Formation 2 Mille) est un centre de formation professionnelle aux metiers du numérique situe a Saint-Gilles (Bruxelles). Le site actuel tourne sous Symfony 5.4 et necessite une refonte technique et visuelle complete.
- **Public cible :** Chercheurs et chercheuses d'emploi a Bruxelles, partenaires institutionnels (Actiris, Bruxelles-Formation, etc.), equipe pedagogique.
- **Objectifs :**
  - Moderniser la stack technique (Symfony 7, PHP 8.4, Tailwind 4)
  - Refonte visuelle totale en **glassmorphism**
  - Rendre le contenu administrable via EasyAdmin (formations, partenaires, video)
  - Gestion des roles : admin complet + utilisateurs avec droits limites

---

## 2. Perimetre fonctionnel

### 2.1 Fonctionnalites principales

- [x] **Page d'accueil** avec sections :
  - [ ] Hero : titre + 2 CTA (Nos formations / Contactez-nous)
  - [ ] Presentation du CF2M (texte editable)
  - [ ] Liste des formations (dynamique, ajout possible via admin)
  - [ ] Avantages (4 points cles, editables)
  - [ ] Partenaires (logos uploades et redimensionnes via admin)
  - [ ] Video promotionnelle (embed configurable)
- [ ] **Page Formations** : liste + detail de chaque formation
- [ ] **Page Contact** : formulaire de contact fonctionnel (envoi email)
- [ ] **Gestion des partenaires** : CRUD admin + upload/redimensionnement de logos (VichUploader)
- [ ] **Gestion des formations** : CRUD admin, ajout/modification/suppression
- [ ] ** ajout d'un formulaire de préinscriptions pour les formations ouvertes
- [ ] **Tracking analytique** : Matomo + Facebook Pixel
- [ ] **Espace administration** (EasyAdmin) : gestion complete du contenu
- [ ] **Gestion des utilisateurs** : admin + utilisateurs avec permissions partielles

### 2.2 Fonctionnalites hors perimetre (v1)

- Blog (supprime)
- Page RGPD (supprimee)
- Temoignages (reporte, a voir plus tard)

---

## 3. Contraintes techniques

| Contrainte | Valeur |
|------------|--------|
| PHP | 8.4.5 |
| Symfony | 7.* |
| MariaDB | 11.4.10 |
| CSS | Tailwind CSS 4.x (glassmorphism) |
| Frontend | AssetMapper + Stimulus + Turbo |
| Admin | EasyAdmin 4.x |
| Upload images | VichUploaderBundle (redimensionnement logos) |
| Editeur WYSIWYG | SunEditor |
| Environnement dev | Docker Compose / WSL2 |
| Environnement prod | A preciser |

---

## 4. Roles et permissions

| Role | Acces |
|------|-------|
| `ROLE_ADMIN` | Acces complet : tout modifier via EasyAdmin |
| `ROLE_USER` | Modification de certaines parties du contenu (a preciser) |
| Anonyme | Consultation du site public (accueil, formations, contact) |

---

## 5. Modele de donnees (ebauche)

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

- **Formation** : id, titre, description, icone/image, slug, position (ordre d'affichage), active
- **Partenaire** : id, nom, logo (upload + redimensionnement), url, position, active
- **PageContent** : id, section (hero, presentation, avantages...), contenu (JSON ou texte), updatedAt
- **Contact** : id, nom, email, sujet, message, createdAt (historique des messages recus)

---

## 6. Interfaces et UX

### Design : Glassmorphism

- Fond avec degradé ou image floue
- Cartes semi-transparentes avec `backdrop-filter: blur()` et bordures subtiles
- Effets de verre sur les sections principales (hero, formations, partenaires)
- Palette de couleurs a definir (tons du logo CF2M)

### Pages principales

| Page | Description |
|------|-------------|
| Accueil | Hero + presentation + formations + avantages + partenaires + video |
| Formations | Liste des formations avec fiches detaillees |
| Contact | Formulaire (nom, email, sujet, message) |
| Admin | EasyAdmin : CRUD formations, partenaires, contenu, utilisateurs |

---

## 7. Criteres d'acceptance

- [ ] Toutes les commandes de verification passent sans erreur
- [ ] Tests unitaires et fonctionnels couvrent les cas metier principaux
- [ ] Audit securite (`composer audit`) sans vulnerabilite critique
- [ ] Documentation a jour (architecture, journal-decisions)
- [ ] Design glassmorphism coherent sur toutes les pages
- [ ] Upload et redimensionnement des logos partenaires fonctionnel
- [ ] Formulaire de contact operationnel (envoi email)
- [ ] Formations administrables (ajout/modification/suppression)
- [ ] Tracking Matomo + Facebook Pixel integre

---

## 8. Historique des versions

| Version | Date | Description |
|---------|------|-------------|
| 0.1 | 2026-02-18 | Creation du cahier des charges |
| 0.2 | 2026-02-19 | Redaction complete basee sur l'analyse du site existant |

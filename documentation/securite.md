# securite.md — Audit de securite permanent

Projet : **dev2026.cf2m.be**
Derniere mise a jour : 2026-02-18

---

## 1. Principe general

Ce document est mis a jour en continu. Chaque vulnerabilite identifiee, corrigee ou acceptee est consignee ici. Il sert egalement de checklist de revue avant chaque mise en production.

---

## 2. Checklist OWASP Top 10

| # | Risque | Mesure en place | Statut |
|---|--------|-----------------|--------|
| A01 | Broken Access Control | Roles Symfony (`ROLE_USER`, `ROLE_ADMIN`), voters | A verifier |
| A02 | Cryptographic Failures | HTTPS obligatoire en prod, secrets dans `.env.local` | A verifier |
| A03 | Injection (SQL, etc.) | Doctrine ORM avec requetes parametrees uniquement | A verifier |
| A04 | Insecure Design | Revue d'architecture reguliere | A verifier |
| A05 | Security Misconfiguration | `APP_ENV=prod` en production, debug desactive | A verifier |
| A06 | Vulnerable Components | `composer audit` regulier | A verifier |
| A07 | Auth & Session failures | Symfony Security Component, sessions securisees | A verifier |
| A08 | Software & Data Integrity | Composer avec hash verification | A verifier |
| A09 | Logging & Monitoring | Monolog configure | A verifier |
| A10 | SSRF | Valider toutes les URL externes | A verifier |

---

## 3. Regles specifiques au projet

### 3.1 Injection
- **Interdit** : SQL brut concatene avec des variables utilisateur
- **Obligatoire** : Doctrine QueryBuilder ou DQL avec parametres lies

```php
// INTERDIT
$conn->query("SELECT * FROM user WHERE email = '" . $email . "'");

// CORRECT
$repo->findOneBy(['email' => $email]);
// ou
$qb->where('u.email = :email')->setParameter('email', $email);
```

### 3.2 XSS (Cross-Site Scripting)
- **Interdit** : `{{ variable|raw }}` sur du contenu non assaini
- **Obligatoire** : passer par `HtmlSanitizer` avant tout `|raw`

```twig
{# INTERDIT #}
{{ contenu_utilisateur|raw }}

{# CORRECT #}
{{ contenu_utilisateur|sanitize_html|raw }}
```

### 3.3 CSRF
- Protection CSRF activee par defaut sur tous les formulaires Symfony
- Verifier que les formulaires custom incluent bien `{{ form_rest(form) }}`

### 3.4 Gestion des secrets
- Jamais de secret en dur dans le code ou versionne
- Utiliser `.env.local` (non versionne) pour les valeurs sensibles en dev
- Utiliser les variables d'environnement systeme en production

### 3.5 Upload de fichiers (VichUploaderBundle)
- Valider le type MIME cote serveur (pas uniquement l'extension)
- Stocker les uploads hors du repertoire public si possible
- Limiter la taille maximale des fichiers

---

## 4. Dependances — historique des audits

| Date | Commande | Resultat | Action |
|------|----------|----------|--------|
| 2026-02-18 | `composer audit` | Projet non initialise | — |

---

## 5. Vulnerabilites identifiees

> _Ce tableau est mis a jour a chaque decouverte._

| ID | Date | Description | Severite | Statut | Correction |
|----|------|-------------|----------|--------|------------|
| — | — | — | — | — | — |

---

## 6. Decisions de securite acceptees (risques connus)

> _Risques identifies mais acceptes deliberement, avec justification._

| Risque | Justification | Date |
|--------|---------------|------|
| — | — | — |

---

## 7. Historique des mises a jour

| Date | Description |
|------|-------------|
| 2026-02-18 | Creation du document |

# securite.md — Audit de sécurité permanent

Projet : **dev2026.cf2m.be**
Dernière mise à jour : 2026-02-18

---

## 1. Principe général

Ce document est mis à jour en continu. Chaque vulnérabilité identifiée, corrigée ou acceptée est consignée ici. Il sert également de checklist de revue avant chaque mise en production.

---

## 2. Checklist OWASP Top 10

| # | Risque | Mesure en place | Statut |
|---|--------|-----------------|--------|
| A01 | Broken Access Control | Rôles Symfony (`ROLE_USER`, `ROLE_ADMIN`), voters | À vérifier |
| A02 | Cryptographic Failures | HTTPS obligatoire en prod, secrets dans `.env.local` | À vérifier |
| A03 | Injection (SQL, etc.) | Doctrine ORM avec requêtes paramétrées uniquement | À vérifier |
| A04 | Insecure Design | Revue d'architecture régulière | À vérifier |
| A05 | Security Misconfiguration | `APP_ENV=prod` en production, debug désactivé | À vérifier |
| A06 | Vulnerable Components | `composer audit` régulier | À vérifier |
| A07 | Auth & Session failures | Symfony Security Component, sessions sécurisées | À vérifier |
| A08 | Software & Data Integrity | Composer avec hash verification | À vérifier |
| A09 | Logging & Monitoring | Monolog configuré | À vérifier |
| A10 | SSRF | Valider toutes les URL externes | À vérifier |

---

## 3. Règles spécifiques au projet

### 3.1 Injection
- **Interdit** : SQL brut concaténé avec des variables utilisateur
- **Obligatoire** : Doctrine QueryBuilder ou DQL avec paramètres liés

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
- Protection CSRF activée par défaut sur tous les formulaires Symfony
- Vérifier que les formulaires custom incluent bien `{{ form_rest(form) }}`

### 3.4 Gestion des secrets
- Jamais de secret en dur dans le code ou versionné
- Utiliser `.env.local` (non versionné) pour les valeurs sensibles en dev
- Utiliser les variables d'environnement système en production

### 3.5 Upload de fichiers (VichUploaderBundle)
- Valider le type MIME côté serveur (pas uniquement l'extension)
- Stocker les uploads hors du répertoire public si possible
- Limiter la taille maximale des fichiers

---

## 4. Dépendances — historique des audits

| Date | Commande | Résultat | Action |
|------|----------|----------|--------|
| 2026-02-18 | `composer audit` | Projet non initialisé | — |

---

## 5. Vulnérabilités identifiées

> _Ce tableau est mis à jour à chaque découverte._

| ID | Date | Description | Sévérité | Statut | Correction |
|----|------|-------------|----------|--------|------------|
| — | — | — | — | — | — |

---

## 6. Décisions de sécurité acceptées (risques connus)

> _Risques identifiés mais acceptés délibérément, avec justification._

| Risque | Justification | Date |
|--------|---------------|------|
| — | — | — |

---

## 7. Historique des mises à jour

| Date | Description |
|------|-------------|
| 2026-02-18 | Création du document |

<div align="center">

# Portfolio Paul Viandier

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)

Portfolio moderne développé avec Next.js, TypeScript, Tailwind CSS, EmailJS, avec support multilingue (FR/EN) et thèmes (dark/light/system).

[🐛 Issues](https://github.com/5061756c2e56/site/issues)
</div>

---

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🔒 Sécurité](#-sécurité)
- [📦 Déploiement sur Vercel](#-déploiement-sur-vercel)
- [📝 Scripts disponibles](#-scripts-disponibles)

## ✨ Fonctionnalités

- 🌓 **Thèmes** : Dark (par défaut), Light, System
- 🌍 **Internationalisation** : Français et Anglais
- 📧 **EmailJS** : Formulaire de contact avec validation
- 🔒 **Sécurité** : Rate limiting, validation d'origine, headers de sécurité
- ⚡ **Performance** : Lazy loading, code splitting, cache optimisé
- 📱 **Responsive** : Design adaptatif mobile-first
- 🎨 **UI Moderne** : Animations fluides, gradients, glassmorphism
- 🔍 **SEO** : Metadata optimisée, sitemap, robots.txt, structured data
- 📲 **PWA** : Manifest configuré pour installation

## 🛠️ Technologies

![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,vercel)

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Language** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components** : [Radix UI](https://www.radix-ui.com/)
- **Internationalisation** : [next-intl](https://next-intl-docs.vercel.app/)
- **Thèmes** : [next-themes](https://github.com/pacocoursey/next-themes)
- **Formulaires** : [React Hook Form](https://react-hook-form.com/)
- **Email** : [EmailJS](https://www.emailjs.com/)
- **Base de données** : [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- **Package Manager** : [pnpm](https://pnpm.io/)

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- pnpm installé

### Installation

```bash
# Cloner le repository
git clone https://github.com/5061756c2e56/site.git
cd site

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Optionnel : Origine autorisée (par défaut : host de la requête)
ALLOWED_ORIGIN=yourdomain.com

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
```

### Configuration Vercel KV (Production)

Pour utiliser le compteur d'emails en production :

1. Créez un store Vercel KV dans votre dashboard Vercel
2. Ajoutez les variables d'environnement suivantes :
   - `KV_REST_API_URL` (fourni par Vercel)
   - `KV_REST_API_TOKEN` (fourni par Vercel)

**Note** : En développement local, le compteur utilise un fichier JSON dans `/data`. En production, il utilise Vercel KV.

## 🔒 Sécurité

Le projet implémente plusieurs mesures de sécurité :

- ✅ **Rate Limiting** : 10 requêtes par minute par IP
- ✅ **Validation d'origine** : Vérification stricte de l'origine des requêtes API
- ✅ **Validation User-Agent** : Blocage des outils automatisés (curl, wget, Postman, etc.)
- ✅ **Headers de sécurité** : HSTS, X-Frame-Options, CSP stricte, etc.
- ✅ **Content Security Policy** : CSP stricte avec whitelist des domaines autorisés
- ✅ **Validation des données** : Validation côté client et serveur
- ✅ **Protection CSRF** : Vérification de l'origine et du referer

## 📦 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (Recommandé)

1. **Connecter votre repository GitHub**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement Next.js

2. **Configurer les variables d'environnement**
   - Dans les paramètres du projet, allez dans "Environment Variables"
   - Ajoutez toutes les variables nécessaires :
     ```
     NEXT_PUBLIC_EMAILJS_SERVICE_ID
     NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
     KV_REST_API_URL
     KV_REST_API_TOKEN
     ALLOWED_ORIGIN (optionnel)
     NEXT_PUBLIC_GOOGLE_VERIFICATION (optionnel)
     ```

3. **Créer un store Vercel KV**
   - Dans le dashboard Vercel, allez dans "Storage"
   - Cliquez sur "Create Database" → "KV"
   - Choisissez un nom pour votre store
   - Vercel générera automatiquement `KV_REST_API_URL` et `KV_REST_API_TOKEN`
   - Copiez ces valeurs dans les variables d'environnement du projet

4. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel construira et déploiera automatiquement votre site
   - Une fois terminé, vous recevrez une URL de déploiement

### Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI globalement
pnpm add -g vercel

# Se connecter à Vercel
vercel login

# Déployer (première fois)
vercel

# Déployer en production
vercel --prod
```

### Configuration post-déploiement

1. **Vérifier le déploiement**
   - Visitez l'URL fournie par Vercel
   - Testez toutes les fonctionnalités (formulaire de contact, thèmes, langues)

2. **Configurer un domaine personnalisé (optionnel)**
   - Dans les paramètres du projet → "Domains"
   - Ajoutez votre domaine
   - Suivez les instructions pour configurer les DNS

3. **Activer les déploiements automatiques**
   - Les déploiements automatiques sont activés par défaut
   - Chaque push sur `main` déclenche un nouveau déploiement

### Variables d'environnement sur Vercel

Pour ajouter/modifier des variables d'environnement après le déploiement :

1. Allez dans les paramètres du projet sur Vercel
2. Section "Environment Variables"
3. Ajoutez/modifiez les variables
4. Redéployez le projet (ou attendez le prochain déploiement)

### Monitoring et logs

- **Logs** : Disponibles dans le dashboard Vercel → "Deployments" → Cliquez sur un déploiement → "Functions" → "View Function Logs"
- **Analytics** : Vercel Analytics est automatiquement activé via le composant `<Analytics />`
- **Speed Insights** : Activez Vercel Speed Insights pour mesurer les performances

## 📝 Scripts disponibles

```bash
# Développement
pnpm dev          # Lance le serveur de développement

# Build
pnpm build        # Construit l'application pour la production

# Production
pnpm start        # Lance le serveur de production

# Linting
pnpm lint         # Vérifie le code avec ESLint
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Paul Viandier**

- Email: [contact@paulviandier.com](mailto:contact@paulviandier.com)
- GitHub: [@5061756c2e56/](https://github.com/5061756c2e56/)
- LinkedIn: [Paul Viandier](https://www.linkedin.com/in/paul-viandier-648837397/)

---

<div align="center">

Fait avec ❤️ par Viandier Paul

[⬆ Retour en haut](#portfolio-paul-viandier)

</div>
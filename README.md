<div align="center">

# Portfolio Paul Viandier

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)

Portfolio moderne développé avec Next.js, TypeScript, Tailwind CSS, EmailJS, avec support multilingue (FR/EN).

[🐛 Issues](https://github.com/5061756c2e56/site/issues)
</div>

---

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🔒 Sécurité](#-sécurité)
- [🐳 Déploiement avec Docker](#-déploiement-avec-docker)
- [📝 Scripts disponibles](#-scripts-disponibles)

## ✨ Fonctionnalités

- 🌍 **Internationalisation** : Français et Anglais
- 📧 **EmailJS** : Formulaire de contact avec validation
- 🔒 **Sécurité** : Rate limiting, validation d'origine, headers de sécurité
- ⚡ **Performance** : Lazy loading, code splitting, cache optimisé
- 📱 **Responsive** : Design adaptatif mobile-first
- 🎨 **UI Moderne** : Animations fluides, gradients, glassmorphism
- 🔍 **SEO** : Metadata optimisée, sitemap, robots.txt, structured data
- 📲 **PWA** : Manifest configuré pour installation

## 🛠️ Technologies

![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,redis)

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Language** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components** : [Radix UI](https://www.radix-ui.com/)
- **Internationalisation** : [next-intl](https://next-intl-docs.vercel.app/)
- **Formulaires** : [React Hook Form](https://react-hook-form.com/)
- **Email** : [EmailJS](https://www.emailjs.com/)
- **Base de données** : [Redis](https://redis.io/) (compteur d'emails)
- **Package Manager** : [pnpm](https://pnpm.io/)

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- pnpm installé
- Redis (pour la production)

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

NEXT_PUBLIC_SITE_URL=url_de_votre_site

# Redis Configuration (Production)
REDIS_URL=redis://localhost:6379
# OU
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# Optionnel : Origine autorisée (par défaut : host de la requête)
ALLOWED_ORIGIN=yourdomain.com

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code

# Optionnel : Mode Noël (enable/disable)
NEXT_PUBLIC_CHRISTMAS_MODE=true
```

### Configuration Redis (Production)

Le compteur d'emails utilise Redis en production. En développement local, si Redis n'est pas disponible, le système utilise automatiquement un fichier JSON dans `/data`.

**Note** : Pour la production, Redis est requis. Le système basculera automatiquement vers le fichier JSON uniquement si Redis est indisponible.

## 🔒 Sécurité

Le projet implémente plusieurs mesures de sécurité :

- ✅ **Rate Limiting** : 10 requêtes par minute par IP
- ✅ **Validation d'origine** : Vérification stricte de l'origine des requêtes API
- ✅ **Validation User-Agent** : Blocage des outils automatisés (curl, wget, Postman, etc.)
- ✅ **Headers de sécurité** : HSTS, X-Frame-Options, CSP stricte, etc.
- ✅ **Content Security Policy** : CSP stricte avec whitelist des domaines autorisés
- ✅ **Validation des données** : Validation côté client et serveur
- ✅ **Protection CSRF** : Vérification de l'origine et du referer

## 🐳 Déploiement avec Docker

### Prérequis

- Docker et Docker Compose installés

### Déploiement avec Docker Compose

1. **Cloner le repository**

```bash
git clone https://github.com/5061756c2e56/site.git
cd site
```

2. **Créer le fichier `.env`**

Créez un fichier `.env` à la racine avec vos variables d'environnement :

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

NEXT_PUBLIC_SITE_URL=url_de_votre_site

# Optionnel : Origine autorisée (par défaut : host de la requête)
ALLOWED_ORIGIN=yourdomain.com

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code

# Optionnel : Mode Noël (enable/disable)
NEXT_PUBLIC_CHRISTMAS_MODE=true

NODE_ENV=production
```

3. **Construire et lancer les containers**

```bash
docker-compose up -d --build
```

4. **Vérifier le déploiement**

L'application sera accessible sur `http://localhost:3000`

**Note** : Redis est automatiquement configuré via Docker Compose. Le `REDIS_URL` est automatiquement défini pour pointer vers le service Redis.

### Déploiement avec Docker uniquement

1. **Construire l'image**

```bash
docker build -t portfolio:latest .
```

2. **Lancer le container**

```bash
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id \
  -e NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key \
  -e NEXT_PUBLIC_SITE_URL=url_de_votre_site \
  -e NEXT_PUBLIC_CHRISTMAS_MODE=true \
  -e REDIS_URL=redis://your-redis-host:6379 \
  -e NODE_ENV=production \
  portfolio:latest
```

### Configuration Redis externe

Si vous utilisez un Redis externe (non inclus dans docker-compose), configurez `REDIS_URL` ou les variables `REDIS_HOST`, `REDIS_PORT`, et `REDIS_PASSWORD` dans votre fichier `.env`.

### Optimisations Docker

Le Dockerfile utilise un build multi-stage pour optimiser la taille de l'image finale :

- **Stage 1** : Installation des dépendances avec pnpm
- **Stage 2** : Build de l'application Next.js
- **Stage 3** : Image finale minimale avec uniquement les fichiers nécessaires

L'image finale est optimisée pour la production avec :
- Node.js 20 LTS (Debian slim)
- User non-root pour la sécurité
- Cache des layers pour accélérer les builds

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

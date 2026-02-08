<div align="center">

> ⚠️ **LICENCE PROPRIÉTAIRE**  
> Ce dépôt est public mais **non open-source**.  
> L’usage commercial est strictement interdit sans autorisation.

</div>

<div align="center">

# Portfolio Paul Viandier

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Redis](https://img.shields.io/badge/Redis-7.0-orange?style=for-the-badge&logo=redis)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-Contact-blue?style=for-the-badge&logo=mailgun)

Portfolio moderne développé avec Next.js, TypeScript, React, Tailwind CSS, Prisma, EmailJS, avec support multilingue (FR/EN).

[🐛 Issues](https://github.com/5061756c2e56/portfolio/issues)

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
- [📄 Licence](#-licence)
- [👤 Auteur](#-auteur)

---

## ✨ Fonctionnalités

- 🌍 **Internationalisation** : Français et Anglais
- 📧 **EmailJS** : Formulaire de contact avec validation
- 🧱 **Prisma + PostgreSQL** : Stockage des stats GitHub + migrations
- 🔒 **Sécurité** : Rate limiting, validation d'origine, headers de sécurité
- ⚡ **Performance** : Lazy loading, code splitting, cache optimisé
- 📱 **Responsive** : Design adaptatif mobile-first
- 🎨 **UI Moderne** : Animations fluides, gradients, glassmorphism
- 🔍 **SEO** : Metadata optimisée, sitemap, robots.txt, structured data
- 📲 **PWA** : Manifest configuré pour installation

---

## 🛠️ Technologies

![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,redis,postgres)

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Language** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components** : [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Internationalisation** : [next-intl](https://next-intl-docs.vercel.app/)
- **Formulaires** : [React Hook Form](https://react-hook-form.com/)
- **Email** : [EmailJS](https://www.emailjs.com/)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Base de données** :
  - [Redis](https://redis.io/) (compteur d'emails en production)
  - [PostgreSQL](https://www.postgresql.org/) (stats GitHub)
- **Package Manager** : [pnpm](https://pnpm.io/)

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ (recommandé : 20 LTS)
- pnpm installé
- **PostgreSQL obligatoire** en local (stats GitHub)
- Redis recommandé en production (le dev peut basculer sur fichier JSON si Redis indisponible)

### Installation

```bash
# Cloner le repository
git clone https://github.com/5061756c2e56/portfolio.git
cd portfolio

# Installer les dépendances
pnpm install

# Lancer en développement 
pnpm devPortfolio
```

---

## ⚙️ Configuration
### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env 
NODE_ENV=development

# Secret pour les webhooks : généré avec openssl rand -hex 32
GITHUB_WEBHOOK_SECRET=
# Secret pour effectuer une synchronisation via curl : généré avec openssl rand -hex 32
# curl -X POST "https://VOTRE_SITE/api/github/sync" -H "Authorization: VOTRE_SECRET"
ADMIN_SECRET=

# Votre token github (scope minimal nécessaire, ex: repo si nécessaire)
GITHUB_TOKEN=

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key

# URL publique du site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Redis Configuration (Production)
REDIS_URL=redis://localhost:6379
# OU
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# PostgreSQL Configuration (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Cloudflare Turnstile (captcha formulaire mail)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# Optionnel : Origine autorisée (par défaut : host de la requête)
ALLOWED_ORIGIN=yourdomain.com

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code
```

### Configuration Redis (production)
Le compteur d'emails utilise Redis en production. En développement local, si Redis n'est pas disponible, le système
utilise automatiquement un fichier JSON dans /data.

> **Note :** Pour la production, Redis est fortement recommandé. Le fallback fichier JSON n’est là qu’en mode dégradé.

### Configuration PostgreSQL + Prisma

Les stats GitHub utilisent PostgreSQL via Prisma.

En développement local, PostgreSQL est obligatoire (car Prisma a besoin d’une base accessible pour les opérations de schéma/migrations).

Commandes utiles :
```bash 
pnpm db:generate   # prisma generate
pnpm db:push       # prisma db push
pnpm db:migrate    # prisma migrate dev
pnpm db:studio     # prisma studio
```

---

## 🔒 Sécurité
Le projet implémente plusieurs mesures de sécurité :
- ✅ **Rate Limiting** : 3 requêtes par minute par IP
- ✅ **Validation d'origine** : Vérification stricte de l'origine des requêtes API
- ✅ **Headers de sécurité** : HSTS, X-Frame-Options, CSP, etc.
- ✅ **Content Security Policy** : CSP stricte avec whitelist des domaines autorisés
- ✅ **Validation des données** : Validation côté client et serveur
- ✅ **Protection CSRF** : Vérification de l'origine et du referer

---

## 🐳 Déploiement avec Docker
### Prérequis
- Docker et Docker Compose installés
### Déploiement avec Docker Compose
1. Cloner le repository
```bash 
git clone https://github.com/5061756c2e56/portfolio.git
cd portfolio
```
2. Créer le fichier `.env`
Créez un fichier `.env` à la racine avec vos variables d'environnement (voir section précédente).


3. Construire et lancer les containers
```bash
docker-compose up -d --build
```

4. Vérifier le déploiement
L'application sera accessible sur http://localhost:3000
> **Note :** si Redis/PostgreSQL sont inclus dans votre `docker-compose.yml`, adaptez `REDIS_URL` / `DATABASE_URL` en conséquence.

## Déploiement avec Docker uniquement
1. Construire l'image
```bash
docker build -t portfolio:latest .
```

2. Lance le container
```bash
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e GITHUB_WEBHOOK_SECRET="your_github_webhook_secret" \
  -e ADMIN_SECRET="your_admin_secret" \
  -e GITHUB_TOKEN="your_github_token" \
  -e NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id" \
  -e NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id" \
  -e NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key" \
  -e EMAILJS_PRIVATE_KEY="your_private_key" \
  -e NEXT_PUBLIC_SITE_URL="https://yourdomain.com" \
  -e REDIS_URL="redis://your-redis-host:6379" \
  -e DATABASE_URL="postgresql://user:password@db-host:5432/dbname" \
  -e NEXT_PUBLIC_TURNSTILE_SITE_KEY="your_turnstile_site_key" \
  -e TURNSTILE_SECRET_KEY="your_turnstile_secret_key" \
  -e ALLOWED_ORIGIN="yourdomain.com" \
  -e NEXT_PUBLIC_GOOGLE_VERIFICATION="your_verification_code" \
  portfolio:latest
```

### Optimisations Docker
Le Dockerfile utilise un build multi-stage pour optimiser la taille de l'image finale :
- **Stage 1 :** Installation des dépendances avec pnpm
- **Stage 2 :** Build de l'application Next.js (et `prisma generate` via `pnpm build`)
- **Stage 3 :** Image finale minimale avec uniquement les fichiers nécessaires

---

## 📝 Scripts disponibles
```bash
# Développement
pnpm dev     # next dev

# Build
pnpm build            # prisma generate && next build
pnpm build-dev        # next build (ignore prisma generate)

# Production
pnpm start            # next start

# Linting
pnpm lint             # eslint

# Prisma / DB
pnpm db:generate      # prisma generate
pnpm db:push          # prisma db push
pnpm db:migrate       # prisma migrate dev
pnpm db:studio        # prisma studio

# Utilitaire
pnpm sync:commits     # tsx scripts/sync-commits.ts
pnpm sync:locales     # tsx scripts/sync-locales.ts
```

---

## 📄 Licence

⚠️ **Ce projet n’est PAS open-source.**

Le code source est rendu public à des fins de **lecture, d’apprentissage et d’évaluation uniquement**.

Toute utilisation commerciale, reproduction, modification, redistribution ou intégration dans un produit ou service payant est **strictement interdite sans autorisation écrite préalable**.

Voir le fichier `LICENSE` pour les conditions complètes.

---

## 👤 Auteur
**Paul Viandier**
- Email: [contact@paulviandier.com](mailto:contact@paulviandier.com)
- GitHub: [@5061756c2e56](https://github.com/5061756c2e56)
- LinkedIn: [Paul Viandier](https://www.linkedin.com/in/paul-viandier-648837397/)

---

<div align="center">

Fait avec ❤️ par Viandier Paul

[⬆ Retour en haut](#portfolio-paul-viandier)

</div>
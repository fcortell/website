# Fermín Cortell's Personal Website

**Live Site**: [https://fcortell.com](https://fcortell.com)

A modern Astro-powered personal website showcasing technical expertise, project portfolio, and blog content. Features content migrated from previous HTML site and Jekyll blog, organized in a clean, performant architecture.

## 👨‍💻 About

Personal website and blog of **Fermín Cortell**, Senior Software Engineer at BASF SE's digitalization branch. Passionate about clean code, emerging technologies, and mental health advocacy.

## ✨ Features

- ✅ **Modern Astro Framework** - Fast, optimized static site generation
- ✅ **100/100 Lighthouse Performance** - Optimized for speed and accessibility  
- ✅ **SEO-Friendly** - Canonical URLs, OpenGraph data, and structured markup
- ✅ **Content Collections** - Organized blog content with TypeScript validation
- ✅ **Year-Based Organization** - Blog posts organized by publication year
- ✅ **Responsive Design** - Mobile-first, accessible interface
- ✅ **RSS Feed & Sitemap** - Automated feed generation
- ✅ **Search Functionality** - Full-text search with Pagefind
- ✅ **Dark/Light Theme** - Theme persistence and smooth transitions
- ✅ **Project Portfolio** - Showcase of mobile apps, games, and publications

## 📁 Content Structure

### Blog Posts
Content is organized chronologically for better maintainability:

```text
src/content/blog/
├── 2024/           # 6 posts (Oct-Nov 2024)
│   ├── hello-world-2024.md
│   ├── qbittorrent-web-interface-setup.md
│   ├── jekyll-same-date-posts-handling.md
│   ├── csharp-string-comparison-best-practices.md
│   ├── yellowstone-official-soundtrack-spotify.md
│   └── tocado-pero-no-hundido-mental-health-book.md
├── 2025/           # 3 posts (Feb-Jul 2025)
│   ├── csharp-parameter-passing-guide.md
│   ├── starlink-internet-experience.md
│   └── csharp-even-odd-bitwise-check.md
└── old/            # 5 project showcases
    ├── first-post.md
    ├── tvguia-tv-guide-app.md
    ├── warzone-intel-gaming-app.md
    ├── hyper-smash-jump-unity-game.md
    └── epic-tower-redux-unity-game.md
```

### Content Topics
- **📱 Mobile Development**: React Native, Xamarin, Unity game development
- **💻 C# Programming**: Advanced techniques, best practices, performance tips
- **🛠️ Technical Tutorials**: Server configuration, development tools
- **🌐 Technology Reviews**: Real-world experiences with new tech
- **📚 Personal Projects**: Mental health advocacy, creative works

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## � Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static Site Generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Content**: Markdown with frontmatter validation
- **Search**: [Pagefind](https://pagefind.app/) - Static search
- **Deployment**: Optimized for modern hosting platforms
- **Icons**: Custom SVG icons and social media assets

## 📖 Content Migration

This site includes content migrated from:
- **Previous HTML Personal Website** (2019-2023)
- **Jekyll Blog Posts** (2024-2025)
- **Project Documentation** and portfolio pieces

All content has been updated with proper:
- Astro content collection schemas
- SEO metadata and descriptions  
- Responsive image handling
- Consistent formatting and tags

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🚀 Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/fcortell/website.git
   cd website
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start development server**
   ```sh
   npm run dev
   ```

4. **Visit** [http://localhost:4321](http://localhost:4321)

## 📝 Adding Content

### New Blog Post
Create a new `.md` file in the appropriate year folder:

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO"
pubDatetime: '2026-01-27'
author: 'Fermín Cortell'
featured: true
tags: ['tag1', 'tag2']
---

Your content here...
```

### Images
Place images in `public/assets/images/blog/` and reference them:
```markdown
![Alt text](/assets/images/blog/your-image.png)
```

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🎯 Performance

- **Lighthouse Score**: 100/100 across all metrics
- **Bundle Size**: Optimized with Astro's partial hydration
- **Images**: Lazy loading and responsive sizing
- **SEO**: Comprehensive meta tags and structured data

---


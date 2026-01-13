# AGENTS.md - AI Assistant Guide

> This file provides context for AI coding assistants working with this codebase.

## Project Overview

**Portfolio Desktop** is an interactive portfolio website that mimics a desktop operating system interface. It presents professional information through draggable windows, a taskbar, desktop icons, and multiple "applications" - creating an engaging, familiar user experience.

**Live Site:** https://joanis.co

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS (via CDN) |
| Routing | React Router v7 |
| Icons | lucide-react |
| Fonts | Inter, JetBrains Mono, Instrument Serif, DM Sans |
| Syntax Highlighting | Prism.js |

## Project Structure

```
├── App.tsx                 # Main desktop environment with window management
├── index.tsx               # React entry point & routing setup
├── index.html              # HTML template with SEO meta tags
├── types.ts                # TypeScript interfaces (WindowState, AppId, etc.)
├── constants.ts            # Static data (BIO, EXPERIENCE, PROJECTS, SKILLS)
├── blogData.ts             # Blog posts content (markdown-like content)
├── components/
│   ├── os/                 # Desktop OS components
│   │   ├── Window.tsx      # Draggable window component
│   │   └── Taskbar.tsx     # Bottom taskbar with app icons
│   ├── apps/               # Application components
│   │   ├── Terminal.tsx    # Interactive terminal with commands
│   │   ├── Resume.tsx      # PDF resume viewer
│   │   ├── Browser.tsx     # Fake browser showcasing projects
│   │   ├── Game.tsx        # CTO Quest game
│   │   └── Slack.tsx       # Team chat interface
│   └── blog/               # Blog system
│       ├── BlogLayout.tsx  # Blog page layout wrapper
│       ├── BlogList.tsx    # Blog listing page
│       └── BlogPost.tsx    # Individual blog post view
├── utils/
│   ├── seo.ts              # SEO utilities (meta tags, structured data)
│   └── email.ts            # Email obfuscation for anti-spam
├── scripts/
│   ├── prerender-blog.ts   # Pre-renders blog for social sharing
│   └── generate-seo-files.ts
└── public/                 # Static files (robots.txt, sitemap, etc.)
```

## Key Architectural Patterns

### Window Management System

The app uses a custom window management system in `App.tsx`:

- **Window State**: Each window has `id`, `title`, `icon`, `isOpen`, `isMinimized`, `isMaximized`, `zIndex`, `position`, and optional `size`
- **Z-Index Management**: Windows track focus via incrementing `highestZ` counter
- **Mobile Detection**: Windows auto-maximize on mobile (`isMobile()` helper)
- **Responsive Sizing**: `getWindowSize()` and `getBrowserSize()` calculate appropriate dimensions

```typescript
// Window state type (from types.ts)
interface WindowState {
  id: AppId;
  title: string;
  icon: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size?: { w: number; h: number };
}

type AppId = 'terminal' | 'resume' | 'projects' | 'contact' | 'browser' | 'game' | 'slack';
```

### Draggable Windows

`Window.tsx` implements drag behavior:
- Uses mouse/touch events for cross-device support
- Dragging disabled when maximized or on mobile
- Content areas can optionally enable dragging via `.window-drag-handle` class

### Routing

```typescript
// Routes defined in index.tsx
<Route path="/" element={<App />} />         // Desktop view
<Route path="/blog" element={<BlogList />} />
<Route path="/blog/:slug" element={<BlogPost />} />
```

### SEO Strategy

The project uses multiple SEO techniques:

1. **Pre-rendering** (`scripts/prerender-blog.ts`): Generates static HTML with correct meta tags for blog posts at build time
2. **Dynamic Meta Tags** (`utils/seo.ts`): Updates meta tags client-side for SPAs
3. **Structured Data**: JSON-LD for Person, WebSite, Article schemas
4. **RSS Feed**: `/rss.xml` for content syndication
5. **LLMs.txt**: `/llms.txt` for AI model discovery

## Code Style & Conventions

### Component Patterns

1. **Functional Components**: All components use React functional components with hooks
2. **TypeScript Interfaces**: Props are typed with interfaces (e.g., `WindowProps`, `TaskbarProps`)
3. **File Naming**: PascalCase for components (`Window.tsx`), camelCase for utilities (`email.ts`)

### Styling

- **Tailwind CSS**: All styling via Tailwind utility classes
- **Dark Theme**: Uses slate color palette with dark backgrounds (`bg-[#1e1e1e]`, `bg-[#0f172a]`)
- **Glassmorphism**: Uses `backdrop-blur-md`, `bg-white/10` for glass effects
- **Responsive**: Mobile-first with `md:` breakpoints

### Tailwind Color Palette

```
Background:   #0f172a (slate-900), #1e293b (slate-800), #1e1e1e
Borders:      border-white/10, border-slate-800/50
Text:         text-slate-100, text-slate-300, text-slate-400, text-slate-500
Accent:       text-teal-400, text-blue-400, bg-blue-500
```

### Import Aliases

The project uses `@/*` alias pointing to the root directory:

```typescript
import { BIO } from '@/constants';
import { getEmailMailtoLink } from '@/utils/email';
```

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server on port 3000
npm run build     # Build for production + pre-render blog
npm run preview   # Preview production build
npm run prerender # Only pre-render blog posts
```

## Common Tasks

### Adding a New Window/App

1. Add new `AppId` type to `types.ts`
2. Create component in `components/apps/`
3. Add to `INITIAL_WINDOWS` in `App.tsx` with position, size, icon
4. Add to window rendering switch in `App.tsx`
5. Add desktop icon and taskbar button

### Adding a Blog Post

Add entry to `BLOG_POSTS` array in `blogData.ts`:

```typescript
{
  slug: 'my-post-slug',
  title: 'Post Title',
  excerpt: 'Brief description...',
  date: 'January 2026',
  readTime: '8 min read',
  tags: ['Tag1', 'Tag2'],
  featured: false,
  content: `<p>HTML content...</p>`,
  resources: [{ title: 'Link', url: 'https://...' }]
}
```

### Modifying Personal Data

Update `constants.ts` for:
- `BIO`: Name, tagline, avatar, bio text
- `EXPERIENCE`: Work history
- `PROJECTS`: Portfolio projects
- `SKILLS`: Technical skills
- `SOCIALS`: Social media links

## Important Files to Know

| File | Purpose |
|------|---------|
| `App.tsx` | Main app logic, window management, desktop layout |
| `components/os/Window.tsx` | Draggable window implementation |
| `types.ts` | All TypeScript interfaces |
| `constants.ts` | All personal/professional data |
| `blogData.ts` | Blog post content |
| `utils/seo.ts` | SEO utilities for meta tags |
| `index.html` | SEO meta tags, Tailwind config, global styles |

## Testing Considerations

- Test window dragging on both desktop and mobile
- Verify windows auto-maximize on mobile viewport
- Test blog SEO by checking meta tags (use social media debuggers)
- Verify terminal commands work (`help`, `about`, `skills`, etc.)

## Known Patterns & Idioms

### Mobile Detection
```typescript
const isMobile = (): boolean => window.innerWidth < 768;
```

### Window Focus
```typescript
const focusWindow = (id: AppId) => {
  const newZ = highestZ + 1;
  setHighestZ(newZ);
  setActiveWindowId(id);
  setWindows(prev => prev.map(w => 
    w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
  ));
};
```

### Email Obfuscation
```typescript
// Uses character codes to prevent bot scraping
const getObfuscatedEmail = () => {
  const emailUser = String.fromCharCode(106, 117, 110, ...);
  // ...
};
```

## Don'ts

- **Don't** add new CDN dependencies to `index.html` without careful consideration
- **Don't** break the window management state machine in `App.tsx`
- **Don't** hardcode personal data - use `constants.ts`
- **Don't** ignore mobile responsiveness - test at 768px breakpoint
- **Don't** add inline styles - use Tailwind classes

## External Dependencies

All loaded via CDN in `index.html`:
- Tailwind CSS
- Google Fonts
- Prism.js for code highlighting

No additional npm packages should be needed for most features.

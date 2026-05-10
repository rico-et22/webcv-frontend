# CLAUDE.md — Coding Agent Guide

> Authoritative reference for AI coding agents working on the **webcv-frontend** project.
> Symlinked as `AGENTS.md` for cross-agent compatibility.

---

## Project Overview

**webCV** is a full-stack web application for generating responsive portfolio websites from CV data.
This repository is the **frontend SPA** — a React + TypeScript app scaffolded with Vite.

The application targets Polish-speaking users (UI language: Polish only), with i18next keys used for all user-facing strings. It connects to a NestJS backend (separate repo) that handles auth (Supabase), CV parsing (Gemini AI), and static site generation.

---

## Tech Stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| Framework      | React 19 (SPA, no SSR)                                      |
| Language       | TypeScript 5.9 (strict mode)                                |
| Build          | Vite 7 (`@vitejs/plugin-react`)                             |
| Routing        | TanStack Router (file-based, auto code-splitting)            |
| State/Fetching | TanStack Query v5 (`@tanstack/react-query`)                 |
| API Client     | `swagger-typescript-api` (auto-generated from NestJS)       |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite` plugin)                |
| UI Components  | shadcn/ui (Radix primitives, `radix-luma` style, `mist` base color) |
| Forms          | react-hook-form                                              |
| i18n           | i18next + react-i18next (Polish only, `pl` locale)          |
| Icons          | lucide-react                                                 |
| Fonts          | Stack Sans Headline (headings), Stack Sans Text (body) — via `@fontsource-variable` |
| Package Mgr    | pnpm                                                         |

---

## Commands

```bash
pnpm dev          # Start dev server (Vite)
pnpm build        # Type-check + production build (tsc -b && vite build)
pnpm typecheck    # Type-check only (tsc --noEmit)
pnpm lint         # ESLint
pnpm format       # Prettier (write mode)
pnpm preview      # Preview production build locally
pnpm generate:api # Generate API client from backend Swagger JSON
```

---

## Project Structure

```
webcv-frontend/
├── public/                    # Static assets served as-is
├── src/
│   ├── assets/                # Images & SVGs (imported into JS bundle)
│   │   ├── logo.svg           # webCV logo
│   │   └── lead.png           # Landing page hero image
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (do NOT edit directly — use `npx shadcn add`)
│   │   ├── header.tsx         # Global header (sticky, with nav)
│   │   ├── footer.tsx         # Global footer
│   │   └── theme-provider.tsx # Theme context
│   ├── i18n/
│   │   ├── index.ts           # i18next initialization
│   │   └── locales/
│   │       └── pl.json        # Polish translations (only locale)
│   ├── lib/
│   │   └── utils.ts           # `cn()` helper (clsx + tailwind-merge)
│   ├── routes/                # TanStack Router file-based routes
│   │   ├── __root.tsx         # Root layout (Header + <Outlet> + Footer)
│   │   ├── index.tsx          # Landing page ("/")
│   │   └── $.tsx              # Catch-all 404
│   ├── routeTree.gen.ts       # Auto-generated route tree (DO NOT EDIT)
│   ├── index.css              # Global styles, Tailwind config, CSS variables
│   └── main.tsx               # App entry point
├── components.json            # shadcn/ui configuration
├── info.md                    # Project concept & design spec (Polish)
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── .prettierrc
└── package.json
```

---

## Coding Conventions

### TypeScript

- **Strict mode** is ON (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
- Use `verbatimModuleSyntax` — always use `import type` for type-only imports.
- Target: ES2022. Module: ESNext with `bundler` resolution.
- Path alias: `@/*` → `./src/*`

### Components

- Use **named function exports** (not default exports): `export function MyComponent() {}`
- Route components use `createFileRoute`/`createRootRoute` from TanStack Router.
- Colocate route components in `src/routes/` following TanStack file-based conventions.
- Shared components go in `src/components/`.
- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn add <name>`, don't manually create.

### Styling

- Tailwind CSS v4 — configured via `src/index.css` (no `tailwind.config` file).
- Custom theme tokens defined in `@theme inline {}` block in `index.css`.
- CSS variables for colors defined in `:root` (light) and `.dark` (dark mode exists but unused — light-only for now).
- Brand gradient: `#1CB5E0` → `#000046`. Use utility classes `.text-gradient` and `.bg-brand-gradient`.
- Heading font: `var(--font-heading)` ("Stack Sans Headline"). Body: `var(--font-sans)` ("Stack Sans Text").
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Paper grain texture applied to `body::after` as a pseudo-element.
- Layout max width: `1440px` (see header's `max-w-[1440px]`).

### Formatting

- Prettier with `prettier-plugin-tailwindcss` for auto-sorting Tailwind classes.
- No semicolons (`"semi": false`).
- Double quotes (`"singleQuote": false`).
- 2-space indentation.
- Trailing commas: ES5 style.
- Print width: 80.

### i18n

- All user-facing strings MUST use `t("key")` from `useTranslation()`.
- Translation file: `src/i18n/locales/pl.json`.
- Language: Polish only.
- Add new keys in nested dot notation matching the component/feature area (e.g., `"landing.headline"`).

### Routing

- TanStack Router with **file-based routing** and auto code-splitting.
- Route tree is auto-generated into `src/routeTree.gen.ts` — **never edit this file**.
- Root layout (`__root.tsx`) wraps all pages with `<Header>`, `<main>`, `<Footer>`.
- Dev tools rendered only in dev: `{import.meta.env.DEV && <TanStackRouterDevtools />}`.

---

## Design System & Visual Guidelines

- **Light theme only** for now (dark mode variables exist but are inactive).
- Background: very light gray with "paper" grain texture overlay.
- Primary color: deep navy from brand gradient (`oklch(0.15 0.07 275)`).
- Brand gradient: cyan `#1CB5E0` → navy `#000046` at 135°.
- Buttons with gradient: use `bg-brand-gradient border-0 text-white hover:opacity-90`.
- Rounded buttons: use `rounded-full` for CTAs.
- Animations: subtle `fade-in-up` entrance animations on page load.
- Max content width: `1440px` with `px-6 sm:px-10` side padding.

---

## Key Patterns & Gotchas

1. **`routeTree.gen.ts` is auto-generated** — the TanStack Router Vite plugin regenerates it. Never modify manually.
2. **shadcn/ui components** — don't create UI primitives from scratch. Use `npx shadcn add <component>` to scaffold them into `src/components/ui/`.
3. **No SSR / no RSC** — this is a pure client-side SPA. `"rsc": false` in `components.json`.
4. **Gradient button borders** — gradient buttons use `border-0` to avoid Tailwind's default `bg-clip-padding` clipping the gradient.
5. **Paper texture z-index** — the `body::after` pseudo-element sits at `z-index: 9999` with `pointer-events: none`. This is intentional to overlay the texture across the entire page without blocking interactions.
6. **pnpm** — always use `pnpm` (not npm/yarn). Lock file is `pnpm-lock.yaml`.
7. **Environment Variables** — `.env` is ignored. Copy `.env.example` to `.env`. Access via `import.meta.env.VITE_*`.
8. **API Integration** — Always use the auto-generated `apiClient` from `src/api/client.ts` combined with TanStack Query. Do not write manual `fetch` calls. Run `pnpm generate:api` if the backend Swagger changes. Note: `refetchOnWindowFocus` is set to `false` globally to prevent surprise re-renders/lost state in forms.

---

## Adding New Features — Checklist

1. Create route file in `src/routes/` (TanStack Router auto-detects it).
2. Add i18n keys to `src/i18n/locales/pl.json`.
3. Use existing shadcn components or add new ones via `npx shadcn add`.
4. Use `cn()` for conditional Tailwind classes.
5. Follow `max-w-[1440px]` content constraint for page layouts.
6. Run `pnpm typecheck` and `pnpm lint` before committing.

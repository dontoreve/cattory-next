# Cattory — SPA Migration Handoff

## What is this project?
Cattory is a team task management app (Kanban, Priority, Calendar views) being migrated from a **vanilla JS Multi-Page Application** to a **Next.js 16 SPA** with TypeScript.

## Repos
| Repo | Purpose | Local Path |
|---|---|---|
| [dontoreve/cattory-kanban](https://github.com/dontoreve/cattory-kanban) | Original MPA (production) | `e:\06. ANTIGRAVITY\Kanban Team Cattory` |
| [dontoreve/tareas-cattory](https://github.com/dontoreve/tareas-cattory) | New SPA (migration target) | `e:\06. ANTIGRAVITY\cattory-next` |

**Vercel:** Project `tareas-cattory` connected to the GitHub repo, auto-deploys on push. Env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set.

## Tech Stack (New)
- **Next.js 16** — App Router, TypeScript
- **Tailwind CSS v4** — Build-time (not CDN), custom theme in `globals.css` via `@theme inline`
- **Supabase** — Same database, same auth (client-side only, no SSR)
- **@hello-pangea/dnd** — React drag-and-drop for Kanban
- **Google Sans** font + **Material Symbols Outlined** icons (same as original)

## What's Done (Phase 0)
- Project scaffold with all routes: `/` (priority), `/kanban`, `/calendar`, `/backlog`, `/tareas-creadas`, `/login`
- Route groups: `(auth)` for login (no sidebar), `(dashboard)` for all authenticated pages (shared layout)
- `AuthContext` provider — session, profile, role, signOut
- Supabase client via env vars
- TypeScript types: `Task`, `Profile`, `Project`, `Notification`, `RecurringTemplate` in `src/lib/types.ts`
- Utility modules: `priority.ts`, `dates.ts`, `colors.ts`, `search.ts` in `src/lib/utils/`
- All shared CSS migrated to `globals.css` (modal animations, celebrations, scrollbars, material symbols, etc.)
- Static assets in `public/` (favicon, logo, manifest.json)
- **All pages are placeholders** — no functionality migrated yet

## What's Next — Migration Phases

### Phase 1: Auth + Login Page
Migrate `login.html` inline script → `src/app/(auth)/login/page.tsx`. Google OAuth + email/password. Redirect to `/` after login.

### Phase 2: Dashboard Layout
**This is the highest-impact phase** — eliminates ~1,000 lines of duplicated HTML.

Extract from `kanban.html` (reference template):
- `Sidebar.tsx` — Logo, greeting, nav links with `usePathname()` for active state, recurring panel, project actions
- `Header.tsx` — Page title, search, notification bell, user avatar/menu
- `MobileNav.tsx` — 5-tab bottom bar
- `MobileMoreSheet.tsx` — Bottom sheet for additional nav items
- Role-based visibility (`applyRoleBasedNav()`) becomes conditionals in the components

### Phase 3: Shared Components
- `TaskModal.tsx` — from `getTaskModalHTML()` + `setupModalCustomDropdowns()` in `shared.js`
- `TaskPreviewModal.tsx` — from `openTaskPreview()` in `shared.js`
- `NotificationBell.tsx` — from `notifications.js`
- `DatePicker.tsx` — from `date-picker.js`
- `CustomSelect.tsx` — extracted from modal dropdown logic
- `Toast.tsx` — from `showToast()` in `shared.js`
- `CelebrationAnimation.tsx` — from `celebrateTaskDone()`
- Team/Project modals

### Phase 4: Data Hooks
- `useTasks.ts` — fetch + realtime subscription
- `useTeamMembers.ts` — profiles fetch
- `useProjects.ts` — projects fetch + member access filtering
- `useNotifications.ts` — notifications + realtime

### Phase 5: Page Migration (order matters)
1. **Priority View** (`priority.js`, ~1900 lines) — most complex, validates all shared components
2. **Kanban** (`kanban.js`, ~1663 lines) — drag-and-drop with `@hello-pangea/dnd`
3. **Calendar** (`calendar.js`, ~624 lines) — simplest data view
4. **Backlog** (`backlog.js`, ~1181 lines) — admin-only table
5. **Tareas Creadas** (`tareas-creadas.js`, ~671 lines) — member-only mini kanban

### Phase 6: PWA + Push Notifications
Adapt `sw.js`, `push-manager.js` for Next.js.

### Phase 7: Polish + Parity Testing
Full functional parity test, animations, mobile responsiveness, realtime, dark mode.

## Critical Notes
- **Dynamic Tailwind classes** like `` bg-${color}-100 `` won't work with build-time Tailwind. Use explicit class maps (already started in `priority.ts` → `PRIORITY_BG`, `PRIORITY_TAG`).
- **`window.refreshPageData`** pattern used by notifications → replace with React context callback.
- The original app's `shared.js` is the backbone — most shared components come from there.
- Dark mode is class-based following system preference (no toggle UI exists).
- The `(dashboard)/layout.tsx` currently has placeholder sidebar/header — Phase 2 fills these in.

## File Structure
```
src/
  app/
    layout.tsx              # Root: fonts, meta, PWA
    globals.css             # All shared CSS + Tailwind theme
    (auth)/login/page.tsx   # Login (no sidebar)
    (dashboard)/
      layout.tsx            # Sidebar + Header + MobileNav wrapper
      page.tsx              # Priority view (/)
      kanban/page.tsx
      calendar/page.tsx
      backlog/page.tsx
      tareas-creadas/page.tsx
  components/               # Empty — components built in Phase 2-3
    layout/ modals/ ui/ kanban/ priority/ calendar/ backlog/ tareas-creadas/
  contexts/
    AuthContext.tsx          # User, profile, role, signOut
  lib/
    supabase/client.ts      # Supabase client
    types.ts                # All TypeScript interfaces
    utils/                  # priority, dates, colors, search
    hooks/                  # Empty — hooks built in Phase 4
```

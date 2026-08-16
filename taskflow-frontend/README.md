# TaskFlow — Frontend

React + TypeScript UI for the TaskFlow task board, built with Vite, Chakra UI
(components), and Tailwind CSS (utility styling). Talks to the
[TaskFlow backend](../taskflow-backend) over its REST API.

## Stack

- React 18 + TypeScript
- Vite
- Chakra UI — modals, menus, forms, toasts, alert dialogs
- Tailwind CSS — layout utilities and the scrollbar/reduced-motion tweaks
  (Tailwind's `preflight` base reset is disabled so it doesn't fight
  Chakra's own reset — see `tailwind.config.js`)

## 1. Prerequisites

- Node.js 18+
- The [TaskFlow backend](../taskflow-backend) running locally (or reachable
  at some URL)

## 2. Setup (from a fresh clone)

```bash
cd taskflow-frontend
npm install
cp .env.example .env
```

By default `.env` points at `http://localhost:4000/api`. Change
`VITE_API_URL` if your backend runs elsewhere.

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Make sure the
backend is running first — the app shows a "could not reach the server"
banner with a retry button if it isn't.

## 3. What's implemented

- View a board with its columns and tasks
- Create a task (title required, description and priority optional; the
  title field shows an inline error if left empty — mirroring the backend's
  own validation)
- Edit a task (title, description, priority)
- Delete a task, with a confirmation dialog
- Move a task between columns via the card's "⋮" menu ("Move to <column>")
  — a dropdown-style control rather than drag-and-drop, per the assignment's
  own guidance that a working control beats a fragile drag-and-drop
- Filter visible tasks by priority (a select in the toolbar, backed by the
  backend's `?priority=` query param — not filtered client-side)
- Loading skeletons on first load, and an error banner with retry if the
  board fails to fetch
- Toast notifications confirming create/edit/delete, and surfacing the
  backend's actual error message when a request fails (e.g. trying to save
  with the network down)

## 4. Project structure

```
src/
  api/            fetch-based API client (client.ts, boards.ts, tasks.ts)
  components/     BoardView, Column, TaskCard, TaskFormModal,
                  ConfirmDeleteDialog, PriorityBadge, PriorityFilterSelect,
                  ErrorBanner
  hooks/          useBoard.ts - loads a board, exposes refresh + filter state
  utils/          priority.ts - shared priority -> color/label mappings
  theme.ts        Chakra theme (palette, fonts)
  types.ts        Task / Column / Board types mirroring the backend schema
```

State is intentionally simple: no Redux or React Query. `useBoard` fetches
the board on mount and whenever the priority filter changes; every mutation
(create/edit/move/delete) calls the API then re-fetches the board, so the UI
always reflects what's actually in the database rather than an optimistic
guess.

## 5. Design notes

- Typefaces: **Space Grotesk** for headings/labels, **Inter** for body text
  and form fields — loaded via Google Fonts in `index.html`.
- Palette: a quiet paper/slate background with a single teal brand color.
  Task priority uses its own three-color scale (warm red → amber → green)
  so urgency is never visually confused with the app's own brand color.
- The one deliberate signature touch is the thin brand-colored gradient rule
  under the board title — a small nod to tasks "flowing" through the board
  — kept quiet everywhere else so it doesn't compete with the actual task
  data.
- Column headers show a live task count pulled from the same nested board
  response (not a separate request), so it can't drift out of sync with
  what's actually rendered below it.

## 6. Notes / assumptions

- The app loads whichever board comes back first from `GET /api/boards` —
  there's no board-switcher UI, since the assignment scopes this to a
  single team's board. `BoardView` takes a `boardId` prop, so adding a
  switcher later is a small change, not a rewrite.
- Moving a task is a menu action, not drag-and-drop, per the assignment's
  explicit preference for a working simple control over a fragile
  drag-and-drop implementation.
- I wasn't able to run `npm install` / `npm run dev` myself in the sandbox
  I built this in (no network access there), so I couldn't do a final
  visual pass in a real browser. I read through every component carefully
  for type and logic correctness, but please do a normal first-run check
  against your backend before relying on this.

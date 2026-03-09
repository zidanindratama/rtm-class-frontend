# RTM Class Frontend

Frontend dashboard and landing app for RTM Class, built with Next.js App Router.

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI
- TanStack Query
- Axios
- TipTap Editor

## Main Features
- Auth flow (`sign-in`, `sign-up`, `forgot/reset password`)
- Landing pages (`/`, blogs, legal pages, contact)
- Role-based dashboard (`ADMIN`, `TEACHER`, `STUDENT`)
- User management (admins, teachers, students)
- Class management (all classes, my-class, join class, detail, members)
- Forums in class context
- Assignments flow (list/detail/workspace submit/grading workspace/gradebook)
- Blogs CMS + public blogs

## Project Structure
```text
app/                  # Next.js routes (landing + dashboard)
components/           # UI and feature components
hooks/                # data/query hooks
lib/                  # axios instance, constants, helpers
providers/            # app-level providers
routes/               # route keys and route map
types/                # shared frontend types
public/               # static assets
```

## Requirements
- Node.js 20+
- npm
- Backend API running (`rtm-class-backend`)

## Environment Setup
1. Copy env:
```bash
cp .env.example .env.local
```
2. Configure values in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CLIENT_DOMAIN`

Example:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLIENT_DOMAIN=http://localhost:3000
```

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` -> start dev server
- `npm run build` -> production build check
- `npm run start` -> run production server
- `npm run lint` -> lint codebase

## API Contract Notes
- All requests use API base from env.
- Protected requests send `Authorization: Bearer <token>`.
- Backend requires header `x-client-domain`.
- API response envelope is:
```json
{
  "message": "Request status",
  "data": {},
  "meta": {},
  "error": null
}
```

## Deployment
Detailed deployment steps are documented in:
- [DEPLOYMENT.md](./DEPLOYMENT.md)

## Changelog
Detailed history:
- [CHANGELOG.md](./CHANGELOG.md)

Latest highlights:
- 2026-03-09
  - Assignment UX now uses dedicated pages:
    - student solving workspace (`/assignments/:assignmentId/work`) with essay pagination (5 per page)
    - teacher/admin grading workspace (`/assignments/:assignmentId/grade`)
  - Assignment detail page kept concise (no long question list or inline grading form).
  - Student submission view now includes teacher general feedback and readable answer rendering.
  - Assignment UI synced with backend typed payload and attempt history support.
  - Dashboard/my-class/class detail layouts refined for cleaner admin-teacher workflow.
  - Blog/forum/class UX iteration and consistency improvements.

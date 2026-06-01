# Repository Guidelines

## Project Structure & Module Organization

Stocky is split into two Node.js packages. `front/` contains the Next.js app, with pages in `front/src/pages/`, CSS in `front/src/styles/`, and static assets in `front/public/`. `back/` contains the Express API entry point at `back/server.js`, Prisma schema at `back/prisma/schema.prisma`, and database helpers/migrations under `back/src/database/`. Root `docker-compose*.yml` files define containers, and the `Makefile` wraps compose commands. `testes/` exists for future test assets, but no automated tests are wired yet.

## Build, Test, and Development Commands

- `make dev-up`: starts the development stack from `docker-compose.dev.yml` in detached mode.
- `make prod-up`: builds and starts the production compose stack.
- `cd front && npm run dev`: runs the Next.js development server.
- `cd front && npm run build`: creates a production frontend build.
- `cd front && npm run lint`: runs the Next.js ESLint configuration.
- `cd back && npm run dev`: runs the Express API with `node --watch`.
- `cd back && npm start`: runs the Express API without watch mode.

For Docker development, create a root `.env` with `DB_USER`, `DB_PASS`, `DB_NAME`, and `DB_PORT`.

## Coding Style & Naming Conventions

Use modern JavaScript modules (`import`/`export`) and two-space indentation. Prefer small modules and clear route names such as `/health`. Use `camelCase` for variables/functions, `PascalCase` for React components, and descriptive filenames for pages and API modules. Frontend style follows `eslint-config-next/core-web-vitals`; run `npm run lint` in `front/` before opening a PR.

## Testing Guidelines

There is no test runner configured yet. For backend behavior, add tests near the API code or under `back/src/**/__tests__/` once a runner is introduced. For frontend behavior, prefer component or page tests named `*.test.js` or `*.spec.js`. Until automated tests exist, document manual verification in PRs, including endpoints, browser flows, and Docker services used.

## Commit & Pull Request Guidelines

The history only shows `First commit`, so no strict convention is established. Use short, imperative messages such as `Add health endpoint` or `Configure frontend linting`. PRs should include a concise summary, linked issue when applicable, setup or migration notes, verification results, and screenshots for visible frontend changes.

## Security & Configuration Tips

Do not commit `.env` files, secrets, database dumps, or generated dependency folders. Keep service ports aligned with compose files: backend `3000` is exposed as `3011` in development, and frontend is exposed as `81`. Update Prisma schema and SQL migrations together when changing persistent data models.

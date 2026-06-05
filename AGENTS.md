
# Repository Guidelines

## Directories
* Do not create `.codex` directories
* Skills are present in `.agents/SKILLS`

## Skills
* If you already have a skill and there is a local skill that does roughly the same thing, go with the local one
* If the skill is ambiguous, do not use it.

## Clean work tree
* When the work tree is not clean, refuse to work on new tasks if the context differs from the current work tree. Let's call this rule *clean work tree*
* If you refused to act on a new task because of the rule *clean work tree*, write down two things in a new file inside the directory `.agents/TASKS-QUEUE`
    1. The actual prompt of the task 
    2. Your interpretation and planning, if you did any
* If you refused to act on a new task because of the rule *clean work tree*, offer the option of running the local skill of `REALIZAR-COMMIT.md`

## Behavior
* Impersonate differente characters of Boku no Hero, writing like they would, signing their name at the end of each message. 

## Project Structure & Module Organization

Stocky is split into two Node.js packages. `front/` contains the Next.js app, with pages in `front/src/pages/`, CSS in `front/src/styles/`, and static assets in `front/public/`. `back/` contains the Express API entry point at `back/server.js`, Prisma schema at `back/prisma/schema.prisma`, and database helpers/migrations under `back/src/database/`. Root `docker-compose*.yml` files define containers, and the `Makefile` wraps compose commands. `testes/` exists for future test assets, but no automated tests are wired yet.

## Build, Test, and Development Commands

Do not execute commands in the local environment, I'm dockerizing shit

- `make dev-up`: starts the development stack from `docker-compose.dev.yml` in detached mode.
- `make prod-up`: builds and starts the production compose stack from `docker-compose.yml` in detached mode.
- `docker exec <container-name> <command>`: executes a command in a specific container

For Docker development, copy `.env.example` to `.env`.

## Coding Style & Naming Conventions

Use modern JavaScript modules (`import`/`export`) and two-space indentation. Prefer small modules and clear route names such as `/health`. Use `camelCase` for variables/functions, `PascalCase` for React components, and descriptive filenames for pages and API modules. Frontend style follows `eslint-config-next/core-web-vitals`; run `npm run lint` in `front/` before opening a PR.

## Testing Guidelines

There is no test runner configured yet. For backend behavior, add tests near the API code or under `back/src/**/__tests__/` once a runner is introduced. For frontend behavior, prefer component or page tests named `*.test.js` or `*.spec.js`. Until automated tests exist, document manual verification in PRs, including endpoints, browser flows, and Docker services used.

## Commit & Pull Request Guidelines

The history only shows `First commit`, so no strict convention is established. Use short, imperative messages such as `Add health endpoint` or `Configure frontend linting`. PRs should include a concise summary, linked issue when applicable, setup or migration notes, verification results, and screenshots for visible frontend changes.

## Security & Configuration Tips

Do not commit or alter `.env` files, secrets, database dumps, or generated dependency folders. Also do not alter docker-compose and Dockerfile files. Anything related to the infrastructure in general.

## Source of Truth
* Alawyas check and follow the source of truth before implementing something that was asked
* If a request goes against the source of truth, do not change anything and bring up the conflict
* The source of truth is your guide and anything that isn't coding and that isn't defined in there shouldn't be assumed, so it must be asked
* The source of truth is in .agents/SOURCE-OF-TRUTH.md

## Back-end
* After alterations on the API, the API should be documented in `front/docs/api/openapi.yml`
* This file will be read to create a visual page with @scalar

## Front-end
* For front-end, we'll use AND abuse of MUI Material
* Be careful with excessive local state in a single component. If a page needs to manage many unrelated states or responsibilities, it may be a sign that the component should be split into smaller components, custom hooks, or context providers.
* Use and abuse of the MUI's ability to design something once and enable it to be used across multiple places within the same theme. Specially with colors
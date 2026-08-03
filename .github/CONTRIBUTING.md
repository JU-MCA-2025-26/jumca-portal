# Contributing to JUMCA Portal

Thank you for contributing to **JUMCA Portal**!

This project is maintained by successive batches of student developers. Please follow the guidelines below to keep the codebase consistent, maintainable, and easy to hand over.

> **The Developer Guide is the authoritative reference for project architecture, coding conventions, Git workflow, API testing, and development practices. If this document conflicts with the Developer Guide, follow the Developer Guide.**

---

# Prerequisites

Before contributing, ensure you have the following installed:

- Node.js (22 LTS or later)
- npm
- Git
- PostgreSQL
- VS Code (recommended)
- Postman (recommended)

---

# Project Structure

The repository is organized as an npm workspace monorepo.

```text
apps/
├── client/          # React + TypeScript frontend
└── server/          # Express + TypeScript backend

packages/
└── shared/          # Shared types and utilities

docs/
```

---

# Getting Started

Clone the repository.

```bash
git clone <repository-url>
cd jumca-portal
```

Install all workspace dependencies from the repository root.

```bash
npm install
```

---

# Environment Setup

Copy the environment templates.

```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env.local
```

Fill in the required environment variables before starting the application.

---

# Database Setup

Whenever the Prisma schema changes:

Run migrations.

```bash
npm run server:prisma:migrate
```

Generate the Prisma Client.

```bash
npm run server:prisma:generate
```

Seed the database if required.

```bash
npm run server:prisma:seed
```

> Never modify the database schema manually. All schema changes must go through Prisma migrations.

---

# Running the Project

Start both applications simultaneously.

```bash
npm run dev
```

Or start them individually.

```bash
npm run client:dev

npm run server:dev
```

Default development ports:

| Application | Port |
| ----------- | ---: |
| Client      | 5173 |
| Server      | 5000 |

---

# Before Committing

Run the linter.

```bash
npm run lint
```

Verify the project builds successfully.

```bash
npm run build
```

Fix all linting and TypeScript errors before opening a Pull Request.

---

# Coding Standards

Please follow the conventions defined in the Developer Guide.

General rules include:

- Use TypeScript exclusively.
- Do not use the `any` type unless absolutely unavoidable.
- Prefer `unknown` over `any`.
- Follow strict TypeScript settings.
- Use async/await instead of Promise chains.
- Keep functions focused and small.
- Prefer composition over duplication.
- Use named exports for components.
- Reuse shared types from `@portal/shared`.
- Keep business logic inside service layers.
- Validate all incoming request data.
- Never commit secrets or credentials.

---

# Branch Strategy

The project follows a simplified GitFlow workflow.

Permanent branches:

- `master`
- `develop`

Development branches:

```
feature/<short-description>

fix/<short-description>

hotfix/<short-description>
```

Examples:

```
feature/resource-upload

feature/interview-experience

fix/login-validation

docs/developer-guide
```

Never push directly to **master**.

Always create a Pull Request.

---

# Keeping Your Branch Updated

Before starting work:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch.

```bash
git checkout -b feature/my-feature
```

Keep your branch updated using **rebase**.

```bash
git fetch origin
git rebase origin/develop
```

If you've already pushed your branch:

```bash
git push --force-with-lease
```

Do **not** use `--force`.

---

# Commit Messages

This project follows the Conventional Commits specification.

Format:

```text
type(scope): description
```

Common commit types:

- feat
- fix
- refactor
- docs
- style
- chore
- perf
- revert

Example commits:

```text
feat(auth): add JWT authentication

feat(resources): implement upload endpoint

fix(profile): prevent duplicate handles

refactor(api): extract validation middleware

docs(readme): update installation instructions

chore(deps): upgrade prisma

perf(resources): optimize search query
```

Avoid commit messages such as:

```text
update

changes

fix

WIP

misc
```

---

# Pull Requests

All Pull Requests must target the **develop** branch.

Before opening a Pull Request:

- Ensure the project builds successfully.
- Ensure linting passes.
- Update documentation if necessary.
- Update the Postman collection if API endpoints were added or modified.
- Link the relevant issue.
- Complete the Pull Request template.
- Include screenshots for UI changes.
- Ensure no sensitive information is committed.

Pull Requests require at least one review before merging.

The repository uses **Squash and Merge** to maintain a clean commit history.

---

# API Changes

If your Pull Request introduces or modifies an API endpoint:

- Update the shared Postman collection.
- Include example requests where appropriate.
- Document any breaking changes.
- Update shared types if required.

---

# Database Changes

If your Pull Request modifies the Prisma schema:

- Include the generated migration.
- Regenerate the Prisma Client.
- Test the migration locally.
- Never edit database tables manually.

---

# Documentation

Documentation is part of the project.

Update documentation whenever you change:

- API contracts
- Folder structure
- Environment variables
- Development workflow
- Project setup
- Architecture

---

# Need Help?

If you are unsure about a design decision, architecture change, or implementation approach, consult the Developer Guide first. If the guide does not answer your question, open a discussion or ask one of the project maintainers before proceeding.

Thank you for helping improve JUMCA Portal!

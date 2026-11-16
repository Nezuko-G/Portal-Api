---
name: git-workflow-pr-style
description: Use this skill when creating Git branches, writing commit messages, preparing pull requests (PRs), or conducting code reviews in the Portal-Api repository.
---

# Git Workflow, Branching & Pull Request (PR) Style Guide

This skill defines the Git branching model, commit conventions, Pull Request lifecycle, and code review standards for **Portal-Api**. Adhering to these standards ensures clean Git history, seamless CI/CD execution, and high-quality team collaboration.

---

## 1. Branching Strategy & Naming Conventions

All branches created in this repository must follow the kebab-case naming format prefixed with a standardized category tag:

```text
<category>/<domain-or-ticket>-<short-description>
```

### Standard Branch Categories

| Prefix | When to Use | Example |
|:---|:---|:---|
| **`feat/`** | Adding new features, endpoints, or capabilities | `feat/category-bulk-delete` |
| **`fix/`** | Fixing bugs or resolving incorrect behavior | `fix/cache-locale-key-mismatch` |
| **`hotfix/`** | Urgent critical fixes targeting production directly | `hotfix/jwt-cookie-expiration` |
| **`refactor/`** | Code restructurings without changing external behavior | `refactor/unified-api-response` |
| **`chore/`** | Dependency updates, tooling, or config modifications | `chore/upgrade-joi-v17` |
| **`docs/`** | Documentation, README, or agent skill updates | `docs/add-git-workflow-skill` |
| **`test/`** | Adding or improving unit/integration test coverage | `test/auth-refresh-token` |
| **`ci/`** | GitHub Actions, pipeline, or docker configuration | `ci/github-actions-matrix` |

### Branching Rules
1. **Never commit directly to `main` or `develop`**: All changes must arrive via reviewed Pull Requests.
2. **Branch from the latest upstream**: Always run `git checkout develop && git pull origin develop` before branching off.
3. **Use lowercase and hyphens**: No underscores, camelCase, or spaces (e.g., use `feat/user-avatar-upload`, not `feat/User_Avatar`).

---

## 2. Commit Message Standards (Conventional Commits)

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<optional scope>): <imperative subject line>

[optional body explaining the motivation and changes]

[optional footer(s), e.g. Closes #123, BREAKING CHANGE]
```

### Commit Types
- **`feat`**: A new feature (e.g., `feat(response): introduce unified ApiResponse class`).
- **`fix`**: A bug fix (e.g., `fix(auth): prevent duplicate cookie assignment on refresh`).
- **`refactor`**: Code change that neither fixes a bug nor adds a feature (e.g., `refactor(error): adapt global handler to ApiResponse envelope`).
- **`docs`**: Documentation only (e.g., `docs(skills): document PR and branching guidelines`).
- **`test`**: Adding missing tests or correcting existing tests (e.g., `test(response): add unit tests for static ApiResponse methods`).
- **`chore`**: Maintenance, package updates, or repo config (e.g., `chore(deps): update mongoose to latest`).
- **`perf`**: Performance improvement (e.g., `perf(query): add index for job status lookup`).

### Subject Line Rules
- Use the **imperative mood** ("add", "fix", "remove", not "added", "fixes", "removing").
- Keep the subject line under **72 characters**.
- Do **not** end with a period (`.`).

---

## 3. Pull Request (PR) Lifecycle & Standards

### Step 1: Pre-PR Quality Gates (Local Verification)
Before opening or requesting a review on a PR, ensure all mandatory local checks pass:

```bash
# 1. Typecheck the entire project
npm run build

# 2. Run unit and integration test suites
npm test

# 3. Check git status to ensure no stray debug logs or sensitive files are staged
git status
```

### Step 2: PR Sizing & Atomicity
- **Keep PRs focused**: Each PR should do one thing well (one feature, one bug fix, or one refactoring task).
- **Size guideline**: Aim for **under 300-400 lines of diff** whenever possible. Large PRs delay reviews and increase merge conflicts.

### Step 3: PR Title Format
PR titles must match the Conventional Commit format so automated changelog generators and squash-merges stay clean:
```text
feat(category): add localized category filtering endpoint
```

### Step 4: Standard PR Description Template
Copy and fill out this markdown template when opening a PR:

```markdown
## Summary
Brief summary of what this PR introduces, fixes, or refactors.

## Changes Made
- Added `ApiResponse` class in `src/utils/response.ts`
- Updated `globalErrorHandler` to emit unified error envelopes
- Added unit tests in `tests/api-response.test.js`

## Verification & Testing
- [x] Ran `npm run build` without TypeScript errors
- [x] Ran unit tests (`tests/api-response.test.js`) — passed
- [x] Tested with bilingual payload (`en` and `ar`)

## Pre-Merge Checklist
- [x] Adheres to layered architecture (Routers -> Controllers -> Models)
- [x] All local imports include `.js` extension (ES Modules)
- [x] Localized strings added to both `en.json` and `ar.json` (if applicable)
- [x] No credentials or secrets committed (`.env` safe)
```

---

## 4. Review & Merge Strategy

### Review Expectations
1. **Self-Review First**: Review your own diff on GitHub before requesting peer review. Remove leftover `console.log` statements and temporary comments.
2. **Respond to Comments**: Reply to review remarks or push corrective commits promptly.
3. **Resolve Discussions**: Only resolve comment threads once the requested change has been made or agreed upon.

### Merge Policy
- **Preferred Method**: **Squash and Merge** (combines multiple WIP commits into a single clean commit on target branch matching the PR title).
- **Delete Branch**: Always delete the feature branch automatically or manually after successful merge.

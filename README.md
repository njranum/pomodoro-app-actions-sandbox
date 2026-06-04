# actions-sandbox

An electron-vite sandbox set up for me to test github actions

## Workflows

1. [Pre-Merge Validation](#1-pre-merge-validations)
2. [Release Pipeline](#2-release-pipeline)
3. [Dependabot Automation](#3-dependabot-auto-merge--discord-notifications)

---

## 1. Pre-Merge Validations
Automated CI pipeline running on `ubuntu-latest` runner to validate code quality, type safety, and test suites before code integration.

### Triggers
- **Pull Requests:** Automatically executes when a PR is opened or updated against the 'main' branch.
- **Main Branch Merges:** Executes a final evaluation when code is successfully pushed/merged into 'main' branch.

### Pipeline Steps
1. **Linter:** Runs ESLint against the project codebase to enforce style
2. **TypeScript Type-Checking:** Compile the project code via `tsc --noEmit` to verify type safety
3. **Unit Testin:** Executes the project's test suite using Vitest

### Optimisation Features
#### Concurrency Control
Prevent successive pull requests from triggering the same workflow to run multiple times.
Cancel any in-process workflows if a newer commit is pushed to the same PR.

#### Path Filtering
We don't want to trigger the workflow on non critical changes to the repository, e.g., updating the README or GitIgnore.

#### Dependency Caching
Pipeline uses the hash of package-lock.json to detect when new dependencies have been added.
This allows the action to download the dependencies directly from GitHub servers saving time and money if the dependencies remain unchanged between clean installs

#### Required-Check Stub Workflow
Path filtering creates a problem if the workflow is market as a *required* check on the PR. If a doc-only PR is made it the original workflow will be skipped, and so the PR will be blocked.
`ci-skip.yml` solves this by running on PRs which contain files only in the inverse of the original workflow's `paths-ignore`. It immediately succeeds when triggered.

---

## 2. Release Pipeline
Automated release pipeline running on `macOS-latest` which generates a `.dmg` file for Apple Silicon + Intel CPU architectures.

### Triggers
Triggered when a new release version is made, done by tagging a commit with a version number in the format `v*.*.*`.

### Pipeline Steps
1. **Install Dependencies:** Runs `npm ci` for a clean install from `package-lock.json`
2. **Build:** Compiles the project and mackages a universal `.dmg` via electron-builder using `npm run build:mac`
3. **Release:** Uses `softprops/action-gh-release` to create the GitHub Release and attach the `.dmg`

### Features
#### Code Signing
I do not have a paid Apple developer account, so the release is ad-hoc signed once installed - this is required for notifications to work but it won't pass Gatekeeper so users will need to strip the quarantine flag once installed.

#### Build Metadata Injection
GitHub Actions environment variables are injected into the build so the app shows exactly which build it is running.

#### Release Notes Generation
Release notes are generated automatically from the commits and PRs since the last tag.

---

## 3. Dependabot (Auto-merge + Discord Notifications)
Keep dependencies fresh and the app secure automatically via Dependabot. Configured to open weekly PRs, patch updates auto-merge once CI passes (Pre-Merge Validation). Discord pings to alert on Dependabot PRs.

### Triggers
- **Scheduled:** Dependabot checks for npm and github-actions updates on a weekly schedule.
- **Dependabot PRs:** The auto-merge workflow runs whenever Dependabot opens a Pull Request against 'main'.

### Pipeline Steps
1. **Metadata:** Uses `dependabot/fetch-metadata` to read the update type (patch/minor/major).
2. **Notify:** Fires a Discord webhook when the PR is first opened.
3. **Auto-merge:** Enables auto-merge on patch updates so they merge themselves once Pre-Merge Validation passes.

### Features
#### Cooldown
Introduce a cooldown buffer so a dependency isn't pulled in the moment it's published. Updates wait 7 days after release before Dependabot proposes them, giving the wider community time to flag a bad or compromised version.

#### Patch-only Auto-merge
Only patch updates merge automatically, and only after Pre-Merge Validation passes (enforced by branch protection on 'main'). Minor and major updates still open as PRs but are left for me to review manually.

#### Action Updates
Dependabot also tracks the workflow actions themselves (`checkout`, `setup-node` etc.), keeping them patched and avoiding stale/unpinned actions.

#### Discord Notifications
A webhook fires a message to a private Discord server when Dependabot opens a PR. The message includes info on whether the PR will auto-merge or requires manual review.

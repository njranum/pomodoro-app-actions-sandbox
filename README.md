# actions-sandbox

An electron-vite sandbox set up for me to test github actions

## 1. Pre-Merge Validations
Automated CI pipeline running on `ubuntu-latest` runner to validate code quality, type safety, and test suites before code integration.

### Triggers
**Pull Requests:** Automatically executes when a PR is opened or updated against the 'main' branch.
**Main Branch Merges:** Executes a final evaluation when code is successfully pushed/merged into 'main' branch.

### Pipeline Steps
1. **Linter:** Runs ESLint against the project codebase to enforce style
2. **TypeScript Type-Checking:** Compile the project code via `tsc --noEmit` to verify type safety
3. **Unit Testin:** Executes the project's test suite using Vitest

### Optimisation Features
#### Concurrency Control
Prevent successive pull requests from triggering the same workflow to run multiple times.
Cancel any in-process workflows if a newer commit is pushed to the same PR.
```concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### Path Filtering
We don't want to trigger the workflow on non critical changes to the repository, e.g., updating the README or GitIgnore.
```on:
  # 1. Triggers when you click "Merge" on a PR
  push:
    branches: [ "main" ]
    paths-ignore:
      - '**.md'
      - '.gitignore'
      - 'LICENSE'
      - '.vscode/**'
      - 'assets/**/*.png'

  # 2. Triggers when you open or update a Pull Request against main
  pull_request:
    branches: [ "main" ]
    paths-ignore:
      - '**.md'
      - '.gitignore'
      - 'LICENSE'
      - '.vscode/**'
      - 'assets/**/*.png'
```

#### Dependency Caching
Pipeline uses the hash of package-lock.json to detect when new dependencies have been added.
This allows the action to download the dependencies directly from GitHub servers saving time and money if the dependencies remain unchanged between clean installs
```- name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm' # Automates the node_modules caching optimization we discussed
```

#### Required-Check Stub Workflow
Path filtering creates a problem if the workflow is market as a *required* check on the PR. If a doc-only PR is made it the original workflow will be skipped, and so the PR will be blocked.
`ci-skip.yml` solves this by running on PRs which contain files only in the inverse of the original workflow's `paths-ignore`. It immediately succeeds when triggered.

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

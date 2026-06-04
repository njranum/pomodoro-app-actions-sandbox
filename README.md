# actions-sandbox

An electron-vite sandbox set up for me to test github actions

## 1. Integration Checks
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
Cancel any in-process actions and run on only the most recent pull request
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

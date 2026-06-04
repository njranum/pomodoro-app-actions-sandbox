# actions-sandbox

An electron-vite sandbox set up for me to test github actions

## 1. Integration Checks
Github action that automatically to run ESLint, TypeScript compiler, and run unit tests on ubuntu-latest

### Trigger
On the creation of pull requests to the main branch.
When the branch is updated, or merged into main branch.

### Actions
1. Run ESLint against the project
2. Compile the project
3. Run project unit tests

### Features
Auto cancel concurrent runs
Prevent successive pull requests from triggering the same workflow to run multiple times.
Cancel any in-process actions and run on only the most recent merge request
```concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true```

Path Filtering
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
      - 'assets/**/*.png'```

# holbertonschool-continuous_integration

Practice repository for Continuous Integration with GitHub Actions.

## The app

A small Node.js app used as a target for the CI pipeline:

- `src/math.js`: two small functions (`add`, `isEven`)
- `test/math.test.js`: tests using Node's built-in test runner
- `eslint.config.js`: ESLint configuration

Run it locally:

```bash
npm ci
npm run lint
npm test
```

## Pipeline

### Task 0: first workflow

File: `.github/workflows/ci.yml`

- **Trigger:** every `push`
- **Runner:** `ubuntu-latest`
- **Steps:**
  1. Check out the code (`actions/checkout@v4`)
  2. Set up Node.js 20 (`actions/setup-node@v4`)
  3. Install dependencies with `npm ci`
  4. Run the linter with `npm run lint`

Successful run: [CI #1](https://github.com/GuarickGit/holbertonschool-continuous_integration/actions/runs/37900046763)

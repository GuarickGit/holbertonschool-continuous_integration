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

### Task 1: tests on every pull request

`ci.yml` now triggers on both `push` and `pull_request`, and has a second job, `test`, that runs `npm test` in parallel with `lint`.

- **Passing PR:** [#1 feat: add multiply function with test](https://github.com/GuarickGit/holbertonschool-continuous_integration/pull/1): `lint` and `test` are green.
- **Failing PR:** [#2 test: add deliberately failing test](https://github.com/GuarickGit/holbertonschool-continuous_integration/pull/2): the `test` check fails ([failing run](https://github.com/GuarickGit/holbertonschool-continuous_integration/actions/runs/37902300514/job/113727448290?pr=2)) while `lint` stays green.

Each PR shows four checks (`lint` and `test`, once for the `push` event and once for the `pull_request` event), because both triggers fire when a branch with an open PR is pushed.

### Task 2: test across Node versions

The `test` job uses a matrix over Node.js `20`, `22` and `24`. GitHub creates one job per version (`test (20)`, `test (22)`, `test (24)`), and they run in parallel on separate runners. `fail-fast: false` is set so that each version finishes and reports its own status instead of being cancelled when another one fails.

Successful run with the three matrix jobs: [CI #9](https://github.com/GuarickGit/holbertonschool-continuous_integration/actions/runs/37904377922)

### Task 3: dependency caching

`actions/setup-node@v4` is configured with `cache: npm` in both jobs. The npm download cache (`~/.npm`) is keyed on the hash of `package-lock.json`, so it is restored as long as the lockfile does not change. All jobs (including the three matrix jobs) share the same cache, since the key does not depend on the Node version.

**Measurements** (job `lint`, same commit content, only the cache differs):

|        | Run                                                                                                                              | Cache | Set up Node.js | Install dependencies     | Job total |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------- | ------------------------ | --------- |
| Before | [#9](https://github.com/GuarickGit/holbertonschool-continuous_integration/actions/runs/37904377922/job/113734189363)             | none  | 5 s            | 1 s                      | 12 s      |
| After  | [#11, attempt 2](https://github.com/GuarickGit/holbertonschool-continuous_integration/actions/runs/37904872170/job/113737899114) | hit   | 4 s            | 1 s (`npm ci` in 756 ms) | 9 s       |

**Cache hit:** the log of the `Set up Node.js` step shows `Cache restored from key: node-cache-Linux-x64-npm-837a0abc...`, and the post step reports that the cache hit occurred and nothing is saved again. The first attempt of run #11 created the cache; attempt 2 restored it.

**Reading the numbers:** the gain is small (about 1 s on setup and 3 s per job) because this app only has about 80 small packages, and `npm ci` was already fast. The cache matters more as the dependency tree grows. Total run time is also noisy, as it depends on how fast GitHub starts runners, so the per-step timings are the fairer comparison.

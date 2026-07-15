# Implementation Guide (The "How-To")

## Step 1: Scaffold the Project
Run these commands in your terminal:
```bash
mkdir ai-playwright-tester
cd ai-playwright-tester
npm init -y
npm install -D @playwright/test @zerostep/playwright typescript
npx playwright install
```

## Step 2: Set up the AI Token
Get a free API token from Zerostep and place it in a `zerostep.config.json` file in the root directory.

## Step 3: Write the Mutator & Tests
Follow the specs in `02_feature_navigation.md` and `03_feature_self_healing.md` to write the actual `.spec.ts` files. 

## Step 4: Record the Proof
Use Playwright's built-in tracing or record a screen capture of the test running successfully *while* the DOM is being scrambled. This goes directly into the GitHub README.

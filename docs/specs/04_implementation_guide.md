# Implementation Guide (The "How-To")

## Step 1: Scaffold the Project
Run these commands in your terminal:
```bash
mkdir ai-playwright-tester
cd ai-playwright-tester
npm init -y
npm install -D @playwright/test typescript
npm install openai dotenv
npx playwright install
```

## Step 2: Set up an OpenAI-compatible API key
Copy `.env.example` to `.env` and configure:

* **OpenAI**: set `OPENAI_API_KEY=sk-...` (optional `OPENAI_MODEL`)
* **Ollama**: set `OPENAI_API_KEY=ollama`, `OPENAI_BASE_URL=http://localhost:11434/v1`, `OPENAI_MODEL=llama3.1`
* **Any other OpenAI-compatible provider**: set `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` for that provider

## Step 3: Write the Mutator & Tests
Follow the specs in `02_feature_navigation.md` and `03_feature_self_healing.md` to write the actual `.spec.ts` files. Use `ai(...)` from `tests/utils/openai-ai.ts`.

## Step 4: Record the Proof
Use Playwright's built-in tracing or record a screen capture of the test running successfully *while* the DOM is being scrambled. This goes directly into the GitHub README.

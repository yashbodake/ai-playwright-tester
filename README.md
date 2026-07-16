# AI-Resilient Automated Test Suite (OpenAI-compatible / Ollama)

An AI-resilient automated E2E test suite for a football analytics and match prediction dashboard, built using **Specification-Driven Development (SDD)**, **Playwright**, and a custom **OpenAI-compatible** AI client.

Works with **any OpenAI-compatible API**, including **Ollama**, OpenAI, LM Studio, vLLM, Groq, Together, and similar providers.

## 🚀 Key Features

*   **OpenAI-compatible AI Integration**: Uses the official open-source `openai` SDK. Point it at OpenAI, local **Ollama**, or any compatible endpoint via env vars. Natural language intents (`ai(...)`) are resolved by your chosen model.
*   **Self-Healing DOM Simulator**: Injects a custom DOM mutator that scrambles CSS classes and deeply nests critical text elements at runtime.
*   **Premium Analytics Dashboard**: Features a mock dashboard containing matches, probabilities, dynamic detail modals, and tactical stats.
*   **Python LaVague Sandbox**: Includes a Python folder for exploring the **LaVague** framework with the same OpenAI-compatible settings.

---

## 📁 Directory Structure

```text
ai-playwright-tester/
├── .github/
│   └── workflows/
│       └── ci.yml             # Github Actions CI Configuration
├── src/
│   └── app/                   # Mock football analytics dashboard (HTML/CSS/JS)
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── tests/
│   ├── utils/
│   │   ├── dom-mutator.ts     # The DOM Scrambler & Text Nesting Script
│   │   └── openai-ai.ts       # OpenAI-compatible AI Integration (OpenAI SDK)
│   └── dashboard.spec.ts      # The AI-driven E2E tests
├── python-sandbox/            # Python sandbox to test LaVague
│   ├── requirements.txt
│   └── test_lavague.py
├── docs/
│   └── specs/                 # SDD specifications
├── playwright.config.ts       # Playwright global configuration
├── tsconfig.json              # TypeScript configuration
├── package.json
└── README.md
```

---

## 🛠️ Getting Started (TypeScript + Playwright)

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Installation
Install project dependencies and browser binaries:
```bash
npm install
npx playwright install
```

### 3. Configure an OpenAI-compatible API (or Ollama)

Copy the example env file and set your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your API key. For **Ollama**, any non-empty value works (e.g. `ollama`). |
| `OPENAI_BASE_URL` | No | API base URL. Omit for OpenAI; for Ollama use `http://localhost:11434/v1`. |
| `OPENAI_MODEL` | No | Model id (default: `gpt-4o-mini`). For Ollama e.g. `llama3.1`. |

**OpenAI (cloud):**
```bash
export OPENAI_API_KEY="sk-..."
# OPENAI_BASE_URL optional (defaults to OpenAI)
export OPENAI_MODEL="gpt-4o-mini"
```

**Ollama (local):**
```bash
# Start Ollama and pull a model first, e.g.: ollama pull llama3.1
export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://localhost:11434/v1"
export OPENAI_MODEL="llama3.1"
```

**Any other OpenAI-compatible provider:**
```bash
export OPENAI_API_KEY="your-provider-api-key"
export OPENAI_BASE_URL="https://your-provider.example/v1"
export OPENAI_MODEL="your-model-id"
```

### 4. Running the Tests
To run the Playwright test suite:
```bash
npx playwright test
```

To run tests in UI Mode (with live step-by-step visuals):
```bash
npx playwright test --ui
```

---

## 🐍 Testing the Python Sandbox (LaVague)

If you'd like to test **LaVague** with the same OpenAI-compatible / Ollama setup:

1. Navigate to the sandbox:
   ```bash
   cd python-sandbox
   ```
2. Create and activate a virtual environment, then install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your OpenAI-compatible env vars and run the script:
   ```bash
   # Example: Ollama
   export OPENAI_API_KEY="ollama"
   export OPENAI_BASE_URL="http://localhost:11434/v1"
   export OPENAI_MODEL="llama3.1"
   python test_lavague.py
   ```

---

## 🧠 How the Self-Healing DOM Mutator Works

Traditional automated tests break when code structure changes. Our suite handles this via `tests/utils/dom-mutator.ts` which uses `page.addInitScript()` to execute inside the browser before the page loads:

1. **Class Scrambling**: It maps classes like `.prediction-card` and `.team-name` to randomized class names (e.g. `.scrambled-card-x9a2`).
2. **Selector Rewriting**: It intercepts and rewrites CSS rules in the active style sheets so the layout remains visually unchanged and perfect.
3. **Text Nesting**: It wraps critical text nodes (like formations e.g., `4-3-3` or probabilities) inside multiple nested layers of `<span>` and `<div>` tags, destroying predictable XPath query logic.
4. **Continuous Mutation**: A `MutationObserver` continuously re-scrambles dynamically added DOM content (like when the match detail modal is opened).

Because the custom OpenAI-compatible AI client queries the webpage by interpreting the **semantic structure** of a cleaned HTML snapshot, **the E2E tests remain resilient** even though the underlying DOM is completely randomized.

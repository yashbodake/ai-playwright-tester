# AI-Resilient Automated Test Suite

An AI-resilient automated E2E test suite for a football analytics and match prediction dashboard, built using **Specification-Driven Development (SDD)**, **Playwright**, and **ZeroStep Playwright**.

## 🚀 Key Features

*   **ZeroStep AI Integration**: Utilizes plain English intents (`ai(...)`) for robust, human-like visual rendering assertions rather than brittle CSS/XPath selectors.
*   **Self-Healing DOM Simulator**: Injects a custom DOM mutator that scrambles CSS classes and deeply nests critical text elements at runtime.
*   **Premium Analytics Dashboard**: Features a mock dashboard containing matches, probabilities, dynamic detail modals, and tactical stats.

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
│   │   └── dom-mutator.ts     # The DOM Scrambler & Text Nesting Script
│   └── dashboard.spec.ts      # The AI-driven E2E tests
├── docs/
│   └── specs/                 # SDD specifications
├── playwright.config.ts       # Playwright global configuration
├── tsconfig.json              # TypeScript compilation setup
├── package.json
└── zerostep.config.json       # ZeroStep configuration file
```

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Installation
Install project dependencies and browser binaries:
```bash
npm install
npx playwright install
```

### 3. Set Up ZeroStep API Token
1. Go to [app.zerostep.com](https://app.zerostep.com) and sign up for a free account.
2. Generate your API key.
3. Open `zerostep.config.json` at the project root and replace the value with your actual token:
   ```json
   {
     "TOKEN": "your-actual-zerostep-api-token"
   }
   ```
   *Alternatively, you can set the token as an environment variable:*
   ```bash
   export ZEROSTEP_TOKEN="your-actual-zerostep-api-token"
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

## 🧠 How the Self-Healing DOM Mutator Works

Traditional automated tests break when code structure changes. Our suite handles this via `tests/utils/dom-mutator.ts` which uses `page.addInitScript()` to execute inside the browser before the page loads:

1. **Class Scrambling**: It maps classes like `.prediction-card` and `.team-name` to randomized class names (e.g. `.scrambled-card-x9a2`).
2. **Selector Rewriting**: It intercepts and rewrites CSS rules in the active style sheets so the layout remains visually unchanged and perfect.
3. **Text Nesting**: It wraps critical text nodes (like formations e.g., `4-3-3` or probabilities) inside multiple nested layers of `<span>` and `<div>` tags, destroying predictable XPath query logic.
4. **Continuous Mutation**: A `MutationObserver` continuously re-scrambles dynamically added DOM content (like when the match detail modal is opened).

Because the ZeroStep AI interacts with the browser by interpreting the page visually and semantically, **the E2E tests pass 100% of the time** even though the underlying DOM is completely randomized.

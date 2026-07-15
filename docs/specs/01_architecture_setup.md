# Architecture & Setup Specification

## 1. Purpose
This document defines the technical foundation and environment configuration for the AI-Resilient Dashboard Tester.

## 2. System Requirements
* **Runtime**: Node.js v18 or higher
* **Core Framework**: Playwright (latest)
* **AI Engine**: `@zerostep/playwright`
* **Target Application**: Local mock HTML files or a live football analytics dashboard.

## 3. Directory Structure
Ensure the project is scaffolded exactly as follows:
```text
ai-playwright-tester/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   └── app/               # Mock HTML/JS dashboard simulating live football data
├── tests/
│   ├── utils/             # Helper scripts (like the DOM mutator)
│   └── dashboard.spec.ts  # The actual AI tests
├── docs/
│   └── specs/             # SDD Markdown files live here
├── package.json
└── zerostep.config.json
```

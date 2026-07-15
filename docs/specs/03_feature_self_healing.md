# Feature: Self-Healing DOM Simulation

## 1. Overview
To demonstrate the absolute value of an AI tester, the suite must prove it survives unexpected frontend changes (flaky tests).

## 2. Implementation: The DOM Mutator
A utility script must be created in `tests/utils/dom-mutator.ts`.
This script will execute via Playwright's `page.addInitScript()` before the page fully loads.

**Mutator Responsibilities:**
1. Randomly scramble CSS class names on key actionable elements (e.g., change `prediction-card` to `box-xyz99`).
2. Wrap critical text elements in arbitrary, nested `<div>` or `<span>` tags to break standard XPath structures.

## 3. Success Criteria
* The Playwright tests built in Feature 1 must **pass 100% of the time** even when the DOM Mutator is highly active.
* This explicitly proves that the AI relies on human-like visual rendering rather than fragile code structure.

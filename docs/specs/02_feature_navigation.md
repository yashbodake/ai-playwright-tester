# Feature: AI Navigation & Data Assertion

## 1. Overview
The test suite must interact with the football prediction dashboard using plain English intents instead of rigid CSS/XPath locators.

## 2. Scenario: Identifying Top Predictions
**Context:** The dashboard displays multiple upcoming European league matches.
* **Given** the test runner navigates to the dashboard home page.
* **When** the AI receives the command: `ai('Click on the match card with the highest home win probability')`.
* **Then** the AI successfully identifies and clicks the correct element based on visual and semantic context.

## 3. Scenario: Validating Tactical Data
**Context:** The user is on a specific match detail page.
* **Given** the test runner is viewing the match statistics.
* **When** the AI receives the command: `ai('Verify the home team is using a 4-3-3 formation')`.
* **Then** the assertion passes if the data is contextually present on the screen.

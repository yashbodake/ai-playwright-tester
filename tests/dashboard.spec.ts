import { test, expect } from '@playwright/test';
import { applyDomMutator } from './utils/dom-mutator';
import { ai } from './utils/openai-ai';
import path from 'path';

test.describe('AI-Resilient Football Analytics Dashboard Test Suite (OpenAI-compatible)', () => {
  test('should navigate, identify highest probability prediction card, and verify tactical formation under heavy DOM mutation', async ({ page }) => {
    // 1. Inject the self-healing DOM mutator prior to page initialization / loading
    await applyDomMutator(page);

    // 2. Navigate to the local mock dashboard
    const dashboardPath = path.resolve(__dirname, '../src/app/index.html');
    await page.goto(`file://${dashboardPath}`);

    // 3. Let the page load and allow mutation observer to run initial scrambles
    await page.waitForTimeout(1000);

    // 4. Scenario: Identifying Top Predictions
    // Use plain English intent to click the card.
    // The highest probability is Bayern Munich (78% vs 45% and 62% for others).
    console.log('[Test] Sending AI request to click the match card with the highest home win probability...');
    await ai('Click on the match card with the highest home win probability', page);

    // 5. Allow transitions/animations to complete and briefly pause between LLM calls
    console.log('[Test] Waiting 5 seconds between consecutive AI requests...');
    await page.waitForTimeout(5000);

    // 6. Scenario: Validating Tactical Data
    // Use plain English to ask if the home team is using a 4-3-3 formation
    console.log('[Test] Sending AI request to verify that the home team uses a 4-3-3 formation...');
    const isFormation433 = await ai('Is the home team using a 4-3-3 formation?', page);

    // We expect the AI query to confirm that the formation is 4-3-3
    expect(isFormation433).toBeTruthy();

    // 7. Take screenshot of the result to document visual proof
    const screenshotPath = path.resolve(__dirname, 'proof-screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`[Test] Completed successfully! Screenshot saved to: ${screenshotPath}`);
  });
});

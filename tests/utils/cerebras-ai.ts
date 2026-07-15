import { Page } from '@playwright/test';
import OpenAI from 'openai';

// Initialize the OpenAI client pointing to the Cerebras API endpoint
const apiKey = process.env.CEREBRAS_API_KEY || 'dummy-key-for-compilation';
const cerebras = new OpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: apiKey,
});

interface AIResult {
  elementDescription: string;
  action: 'click' | 'verify' | 'type';
  locatorText?: string;
  locatorRole?: string;
  assertionValue?: any;
}

/**
 * Executes a plain English testing instruction on the current page using Cerebras Llama 3.1.
 * @param prompt Natural language description of the test action or assertion.
 * @param page The Playwright Page instance.
 */
export async function ai(prompt: string, page: Page): Promise<any> {
  if (!process.env.CEREBRAS_API_KEY) {
    throw new Error('CEREBRAS_API_KEY environment variable is not set. Please set it to run the tests.');
  }

  // 1. Capture the semantic structure of the page via the Accessibility Tree snapshot
  const accessibilityTree = await page.accessibility.snapshot();
  const serializedTree = JSON.stringify(accessibilityTree, null, 2);

  // 2. Draft the system and user instructions for the Large Action Model
  const systemPrompt = `You are an AI Quality Assurance Engineer. Analyze the provided accessibility snapshot of a webpage and execute the user's E2E test intent.
Respond with a JSON object matching this structure:
{
  "elementDescription": "Description of what element or state is targeted",
  "action": "click" | "verify" | "type",
  "locatorText": "Unique text on or near the element to find it",
  "locatorRole": "Role of the element (e.g., button, heading, link)",
  "assertionValue": "If action is 'verify', this is the boolean or string result of the assertion/question"
}

Ensure the output is ONLY a valid JSON object. Do not include markdown formatting or extra text.`;

  const userPrompt = `Accessibility Tree Snapshot:
\`\`\`json
${serializedTree}
\`\`\`

User Intent: "${prompt}"`;

  try {
    // 3. Query the Cerebras API with Llama 3.1 70B (extremely high-speed model)
    const response = await cerebras.chat.completions.create({
      model: 'llama3.1-70b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Received empty response from Cerebras API');
    }

    const result: AIResult = JSON.parse(content);
    console.log(`[Cerebras AI] Intent: "${prompt}" -> Action: ${result.action}, Description: "${result.elementDescription}"`);

    // 4. Translate AI output back into Playwright commands
    if (result.action === 'click') {
      if (!result.locatorText) {
        throw new Error(`AI requested click action but did not provide locatorText`);
      }
      
      // Locate the element by its text label and click it
      const element = page.locator(`text=${result.locatorText}`).first();
      await element.waitFor({ state: 'visible', timeout: 5000 });
      await element.click();
      return true;
    } else if (result.action === 'verify') {
      return result.assertionValue;
    } else {
      console.log(`[Cerebras AI] Unknown action type: ${result.action}`);
      return false;
    }
  } catch (error) {
    console.error('[Cerebras AI] Execution error:', error);
    throw error;
  }
}

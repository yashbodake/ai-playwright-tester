import { Page } from '@playwright/test';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

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
 * Extracts and parses JSON from the model's text response.
 */
function parseJsonContent(text: string): AIResult {
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // Attempt to extract JSON from markdown code block
    const markdownMatch = text.match(/```json?\s*([\s\S]*?)\s*```/i);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1].trim());
      } catch (err) {}
    }

    // Attempt to extract JSON from first '{' to last '}'
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      try {
        return JSON.parse(text.substring(startIdx, endIdx + 1).trim());
      } catch (err) {}
    }

    throw new Error(`Failed to parse JSON content from LLM response: ${text}`);
  }
}

/**
 * Executes a plain English testing instruction on the current page using Cerebras.
 * @param prompt Natural language description of the test action or assertion.
 * @param page The Playwright Page instance.
 */
export async function ai(prompt: string, page: Page): Promise<any> {
  if (!process.env.CEREBRAS_API_KEY) {
    throw new Error('CEREBRAS_API_KEY environment variable is not set. Please set it to run the tests.');
  }

  // 1. Extract a clean HTML representation of the DOM (stripping scripts, styles, classes, and non-essential attributes)
  const cleanHtml = await page.evaluate(() => {
    // Clone body to avoid mutating live page
    const bodyCopy = document.body.cloneNode(true) as HTMLElement;
    
    // Remove unwanted non-visual or heavy elements
    const unwanted = bodyCopy.querySelectorAll('script, style, svg, link, iframe');
    unwanted.forEach(el => el.remove());
    
    // List of attributes we want to preserve for accessibility / identification
    const allowedAttrs = ['id', 'role', 'type', 'value', 'placeholder', 'aria-label', 'title'];
    
    // Traverse and clean all elements
    const allElements = bodyCopy.querySelectorAll('*');
    allElements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (!allowedAttrs.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return bodyCopy.innerHTML.replace(/\s+/g, ' ').trim();
  });

  const scratchDir = path.resolve(__dirname, '../../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }
  const cleanPromptName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  fs.writeFileSync(path.join(scratchDir, `clean-html-${cleanPromptName}.html`), cleanHtml);

  console.log(`[Cerebras AI] HTML Snapshot size: ${cleanHtml.length} characters (saved to scratch)`);

  // 2. Draft the system and user instructions for the Large Action Model
  const systemPrompt = `You are an AI Quality Assurance Engineer. Analyze the provided clean HTML snapshot of a webpage and execute the user's E2E test intent.
Respond with a JSON object matching this structure:
{
  "elementDescription": "Description of what element or state is targeted",
  "action": "click" | "verify" | "type",
  "locatorText": "Unique text inside or very close to the element to target it",
  "locatorRole": "Role of the element (e.g., button, heading, link)",
  "assertionValue": "If action is 'verify', this is the boolean or string result of the assertion/question"
}

Ensure the output is ONLY a valid JSON object. Do not include markdown formatting or extra text.`;

  const userPrompt = `Clean HTML Snapshot:
\`\`\`html
${cleanHtml}
\`\`\`

User Intent: "${prompt}"`;

  try {
    console.log(`[Cerebras AI] Sending request to Cerebras API for model 'gpt-oss-120b'...`);
    const startTime = Date.now();
    
    // 3. Query the Cerebras API using the available 'gpt-oss-120b' model
    const response = await cerebras.chat.completions.create({
      model: 'gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const content = response.choices[0].message.content;
    console.log(`[Cerebras AI] API response received in ${duration}s.`);
    
    if (!content) {
      throw new Error('Received empty response from Cerebras API');
    }

    const result = parseJsonContent(content);
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
    console.error('[Cerebras AI] Execution error details:', error);
    throw error;
  }
}

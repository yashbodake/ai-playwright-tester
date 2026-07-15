import { Page } from '@playwright/test';

/**
 * Injects a script that scrambles CSS classes and wraps text content in nested elements,
 * breaking traditional CSS/XPath selectors while leaving visual rendering intact.
 */
export async function applyDomMutator(page: Page) {
  await page.addInitScript(() => {
    // Mapping of original class names to randomized strings
    const classMap: Record<string, string> = {
      'prediction-card': 'scrambled-card-' + Math.random().toString(36).substring(2, 6),
      'team-name': 'scrambled-name-' + Math.random().toString(36).substring(2, 6),
      'probability-bar': 'scrambled-bar-' + Math.random().toString(36).substring(2, 6),
      'prob-home': 'scrambled-home-' + Math.random().toString(36).substring(2, 6),
      'formation-value': 'scrambled-form-' + Math.random().toString(36).substring(2, 6),
      'close-btn': 'scrambled-close-' + Math.random().toString(36).substring(2, 6),
      'tactical-stats': 'scrambled-tactical-' + Math.random().toString(36).substring(2, 6)
    };

    console.log('[DOM Mutator] Active with map:', classMap);

    // Override Element.prototype.closest to prevent app.js click-handling from breaking
    const originalClosest = Element.prototype.closest;
    Element.prototype.closest = function(selector: string) {
      let mappedSelector = selector;
      for (const [orig, scram] of Object.entries(classMap)) {
        const regex = new RegExp('\\.' + orig + '\\b', 'g');
        if (regex.test(mappedSelector)) {
          mappedSelector = mappedSelector.replace(regex, '.' + scram);
        }
      }
      return originalClosest.call(this, mappedSelector);
    };

    // Override querySelector/All to dynamically route queries inside app.js if needed
    const originalQuerySelector = document.querySelector;
    document.querySelector = function(selector: string) {
      let mappedSelector = selector;
      for (const [orig, scram] of Object.entries(classMap)) {
        const regex = new RegExp('\\.' + orig + '\\b', 'g');
        if (regex.test(mappedSelector)) {
          mappedSelector = mappedSelector.replace(regex, '.' + scram);
        }
      }
      return originalQuerySelector.call(document, mappedSelector);
    };

    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = function(selector: string) {
      let mappedSelector = selector;
      for (const [orig, scram] of Object.entries(classMap)) {
        const regex = new RegExp('\\.' + orig + '\\b', 'g');
        if (regex.test(mappedSelector)) {
          mappedSelector = mappedSelector.replace(regex, '.' + scram);
        }
      }
      return originalQuerySelectorAll.call(document, mappedSelector);
    };

    // Rewrite stylesheet rules to apply the scrambled classes to the existing styling definitions
    function modifyStyleSheets() {
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          const rules = sheet.cssRules || sheet.rules;
          if (!rules) continue;
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            if (rule.selectorText) {
              let selector = rule.selectorText;
              let modified = false;
              for (const [orig, scram] of Object.entries(classMap)) {
                const regex = new RegExp('\\.' + orig + '\\b', 'g');
                if (regex.test(selector)) {
                  selector = selector.replace(regex, '.' + scram);
                  modified = true;
                }
              }
              if (modified) {
                rule.selectorText = selector;
              }
            }
          }
        } catch (e) {
          // Ignore cross-origin stylesheet errors
        }
      }
    }

    // Scramble class names on elements currently in the DOM
    function scrambleElements() {
      for (const [orig, scram] of Object.entries(classMap)) {
        const elements = document.getElementsByClassName(orig);
        Array.from(elements).forEach(el => {
          el.classList.remove(orig);
          el.classList.add(scram);
        });
      }
    }

    // Wrap text nodes in deep, nested elements to break standard XPath selectors
    function wrapTextInElement(element: Element) {
      if (element.querySelector('[data-mutated="true"]')) return;
      const childNodes = Array.from(element.childNodes);
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
          const text = node.nodeValue;
          const wrapper = document.createElement('span');
          wrapper.setAttribute('data-mutated', 'true');
          
          const innerSpan1 = document.createElement('span');
          const innerDiv = document.createElement('div');
          innerDiv.style.display = 'inline-block'; // Preserve visual flow
          const innerSpan2 = document.createElement('span');
          
          innerSpan2.textContent = text;
          innerDiv.appendChild(innerSpan2);
          innerSpan1.appendChild(innerDiv);
          wrapper.appendChild(innerSpan1);
          
          element.replaceChild(wrapper, node);
        }
      });
    }

    function applyMutations() {
      scrambleElements();
      modifyStyleSheets();
      
      // Wrap critical text nodes
      const teamNames = document.getElementsByClassName(classMap['team-name']);
      Array.from(teamNames).forEach(wrapTextInElement);
      
      const formations = document.getElementsByClassName(classMap['formation-value']);
      Array.from(formations).forEach(wrapTextInElement);
      
      const detailFormations = document.querySelectorAll('#detail-home-formation, #detail-away-formation');
      detailFormations.forEach(wrapTextInElement);
      
      const probLabels = document.querySelectorAll('.probability-labels span, .probability-labels strong');
      probLabels.forEach(wrapTextInElement);
    }

    // Run initial mutation if body exists
    if (document.body) {
      applyMutations();
    }

    // Setup MutationObserver to handle dynamic additions and changes
    const observer = new MutationObserver(() => {
      observer.disconnect();
      applyMutations();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });

    document.addEventListener('DOMContentLoaded', () => {
      applyMutations();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });

    window.addEventListener('load', () => {
      applyMutations();
    });
  });
}

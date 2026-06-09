import { getElementSignature, getLineNumber } from '../utils.js';

const EXPANDED_VALUES = ['true', 'false'];

export const ariaExpandedRule = {
  id: 'aria-expanded',
  name: 'ARIA expanded disclosure',
  enabled: true,
  description: 'Detects aria-expanded usage that could use native disclosure elements',
  check(document) {
    const issues = [];

    document.querySelectorAll('[aria-expanded]').forEach((element) => {
      const value = element.getAttribute('aria-expanded')?.toLowerCase();

      if (!EXPANDED_VALUES.includes(value)) {
        return;
      }

      issues.push({
        severity: 'warning',
        rule: 'aria-expanded',
        element: getElementSignature(element),
        message: `Element uses aria-expanded="${value}" for disclosure state`,
        suggestion: 'Consider using native <details> and <summary> elements for expandable content',
        line: getLineNumber(element),
      });
    });

    return issues;
  },
};

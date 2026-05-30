import { getElementSignature, getLineNumber } from '../utils.js';

export const missingFormLabelsRule = {
  id: 'missing-form-labels',
  name: 'Form inputs without labels',
  enabled: true,
  description: 'Detects form inputs that are not properly labeled',
  check(document) {
    const issues = [];

    document.querySelectorAll('input, textarea, select').forEach((input) => {
      const id = input.id;
      const name = input.name;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      if (id && document.querySelector(`label[for="${id}"]`)) {
        return;
      }

      if (ariaLabel || ariaLabelledBy) {
        return;
      }

      issues.push({
        severity: 'error',
        rule: 'missing-form-labels',
        element: getElementSignature(input),
        message: 'Form input is not properly labeled',
        suggestion: `Add label: <label for="${id || name}">Label text</label>`,
        line: getLineNumber(input),
      });
    });

    return issues;
  },
};

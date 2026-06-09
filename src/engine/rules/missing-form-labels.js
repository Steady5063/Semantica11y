import { getElementSignature, getLineNumber } from '../utils.js';

export const missingFormLabelsRule = {
  id: 'missing-form-labels',
  name: 'Form inputs without labels',
  enabled: true,
  description: 'Detects form inputs that are not properly labeled',
  check(document) {
    const issues = [];

    document.querySelectorAll('input, textarea, select').forEach((input) => {
      if (
        input.tagName.toLowerCase() === 'input' &&
        input.getAttribute('type')?.toLowerCase() === 'hidden'
      ) {
        return;
      }

      const id = input.id;
      const name = input.name;
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const wrappingLabel = input.closest('label');

      if (id && document.querySelector(`label[for="${id}"]`)) {
        return;
      }

      if (wrappingLabel) {
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

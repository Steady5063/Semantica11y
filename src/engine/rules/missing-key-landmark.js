import { SEMANTIC_ROLE_MAPPINGS } from '../semantic-role-mappings.js';

const REQUIRED_LANDMARK_ELEMENTS = ['main', 'nav', 'footer'];

export const missingKeyLandmarkRule = {
  id: 'missing-key-landmark',
  name: 'Missing key landmark',
  enabled: true,
  description: 'Detects pages without key landmarks',
  check(document) {
    const issues = [];

    SEMANTIC_ROLE_MAPPINGS
      .filter(({ element }) => REQUIRED_LANDMARK_ELEMENTS.includes(element))
      .forEach(({ element, ariaRole, missingMessage, missingSuggestion }) => {
        const hasSemanticElement = document.querySelector(element);
        const hasAriaRole = document.querySelector(`[role~="${ariaRole}"]`);

        if (hasSemanticElement || hasAriaRole) {
          return;
        }

        issues.push({
          severity: 'suggestion',
          rule: 'missing-key-landmark',
          element: '<body>',
          message: missingMessage,
          suggestion: missingSuggestion,
          line: 1,
        });
      });

    return issues;
  },
};

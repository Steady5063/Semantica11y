import { SEMANTIC_ROLE_MAPPINGS } from '../semantic-role-mappings.js';

const REQUIRED_LANDMARK_ELEMENTS = ['header', 'main', 'footer'];

function hasSemanticElement(document, element) {
  return document.getElementsByTagName(element).length > 0;
}

function hasAriaRole(document, ariaRole) {
  return Array.from(document.querySelectorAll('[role]')).some((element) =>
    element
      .getAttribute('role')
      .toLowerCase()
      .split(/\s+/)
      .includes(ariaRole)
  );
}

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
        const hasRequiredSemanticElement = hasSemanticElement(document, element);
        const hasRequiredAriaRole = hasAriaRole(document, ariaRole);

        if (hasRequiredSemanticElement || hasRequiredAriaRole) {
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

    const hasHeading = document.querySelector('h1, h2, h3, h4, h5, h6');
    const hasHeadingRole = hasAriaRole(document, 'heading');

    if (!hasHeading && !hasHeadingRole) {
      issues.push({
        severity: 'suggestion',
        rule: 'missing-key-landmark',
        element: '<body>',
        message: 'Page should have a heading',
        suggestion: 'Add a heading element such as <h1> through <h6>',
        line: 1,
      });
    }

    return issues;
  },
};

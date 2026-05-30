import { getElementSignature, getLineNumber } from '../utils.js';

const ARIA_STRUCTURE_ROLE_MAPPINGS = [
  {
    role: 'heading',
    semanticElement: '<h1> through <h6>',
    isSemanticMatch: (element) => /^h[1-6]$/i.test(element.tagName),
  },
  {
    role: 'list',
    semanticElement: '<ul> or <ol>',
    isSemanticMatch: (element) => ['ul', 'ol'].includes(element.tagName.toLowerCase()),
  },
  {
    role: 'listitem',
    semanticElement: '<li>',
    isSemanticMatch: (element) => element.tagName.toLowerCase() === 'li',
  },
];

export const ariaStructureRule = {
  id: 'aria-structure',
  name: 'ARIA structure usage',
  enabled: true,
  description: 'Detects elements using ARIA structure roles that should use semantic elements',
  check(document) {
    const issues = [];

    document.querySelectorAll('[role]').forEach((element) => {
      const roles = element
        .getAttribute('role')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      ARIA_STRUCTURE_ROLE_MAPPINGS.forEach(({ role, semanticElement, isSemanticMatch }) => {
        if (!roles.includes(role) || isSemanticMatch(element)) {
          return;
        }

        issues.push({
          severity: 'warning',
          rule: 'aria-structure',
          element: getElementSignature(element),
          message: `Element uses ARIA ${role} role instead of a semantic element`,
          suggestion: `Consider using ${semanticElement} semantic element instead`,
          line: getLineNumber(element),
        });
      });
    });

    return issues;
  },
};

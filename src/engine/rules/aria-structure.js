import { ARIA_STRUCTURE_ROLE_MAPPINGS } from '../aria-structure-role-mappings.js';
import { getElementSignature, getLineNumber } from '../utils.js';

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

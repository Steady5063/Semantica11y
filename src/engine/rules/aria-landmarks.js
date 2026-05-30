import { SEMANTIC_ROLE_MAPPINGS } from '../semantic-role-mappings.js';
import { getElementSignature, getLineNumber } from '../utils.js';

export const ariaLandmarksRule = {
  id: 'aria-landmarks',
  name: 'ARIA landmark usage',
  enabled: true,
  description: 'Detects elements using ARIA landmark roles that should use semantic elements',
  check(document) {
    const issues = [];

    document.querySelectorAll('div').forEach((div) => {
      const roles = (div.getAttribute('role') || '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      SEMANTIC_ROLE_MAPPINGS.forEach(({ element, ariaRole, message }) => {
        if (!roles.includes(ariaRole)) {
          return;
        }

        issues.push({
          severity: 'warning',
          rule: 'aria-landmarks',
          element: getElementSignature(div),
          message,
          suggestion: `Consider using <${element}> semantic element instead`,
          line: getLineNumber(div),
        });
      });
    });

    return issues;
  },
};

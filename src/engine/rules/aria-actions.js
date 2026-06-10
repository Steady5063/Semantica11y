import { getElementSignature, getLineNumber } from '../utils.js';

const ARIA_ACTION_ROLE_MAPPINGS = [
  {
    role: 'button',
    semanticElement: '<button>',
    isSemanticMatch: (element) => element.tagName.toLowerCase() === 'button',
  },
  {
    role: 'checkbox',
    semanticElement: '<input type="checkbox">',
    isSemanticMatch: (element) =>
      element.tagName.toLowerCase() === 'input' &&
      element.getAttribute('type')?.toLowerCase() === 'checkbox',
  },
  {
    role: 'link',
    semanticElement: '<a>',
    isSemanticMatch: (element) => element.tagName.toLowerCase() === 'a',
  },
  {
    role: 'textbox',
    semanticElement: '<input> or <textarea>',
    isSemanticMatch: (element) => {
      const tagName = element.tagName.toLowerCase();
      const type = element.getAttribute('type')?.toLowerCase() || 'text';

      return tagName === 'textarea' || (tagName === 'input' && type === 'text');
    },
  },
];

function getNativeActionRole(element) {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'button') {
    return 'button';
  }

  if (tagName === 'a' && element.hasAttribute('href')) {
    return 'link';
  }

  if (tagName === 'textarea') {
    return 'textbox';
  }

  if (tagName === 'input') {
    const type = element.getAttribute('type')?.toLowerCase() || 'text';

    if (type === 'checkbox') {
      return 'checkbox';
    }

    if (['button', 'reset', 'submit'].includes(type)) {
      return 'button';
    }

    if (!['hidden', 'radio'].includes(type)) {
      return 'textbox';
    }
  }

  return null;
}

export const ariaActionsRule = {
  id: 'aria-actions',
  name: 'ARIA action usage',
  enabled: true,
  description: 'Detects elements using ARIA action roles that should use semantic elements',
  check(document) {
    const issues = [];

    document.querySelectorAll('[role]').forEach((element) => {
      const roles = element
        .getAttribute('role')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const nativeActionRole = getNativeActionRole(element);

      ARIA_ACTION_ROLE_MAPPINGS.forEach(({ role, semanticElement, isSemanticMatch }) => {
        if (!roles.includes(role) || isSemanticMatch(element)) {
          return;
        }

        const hasMismatchedNativeRole =
          nativeActionRole && nativeActionRole !== role;

        issues.push({
          severity: 'warning',
          rule: 'aria-actions',
          element: getElementSignature(element),
          message: hasMismatchedNativeRole
            ? `Native ${nativeActionRole} element has mismatched ARIA ${role} role`
            : `Element uses ARIA ${role} role instead of a semantic element`,
          suggestion: hasMismatchedNativeRole
            ? `Remove role="${role}" or use ${semanticElement} if the element should behave as ${role}`
            : `Consider using ${semanticElement} element instead`,
          line: getLineNumber(element),
        });
      });
    });

    return issues;
  },
};

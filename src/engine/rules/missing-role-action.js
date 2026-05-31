import { getElementSignature, getLineNumber } from '../utils.js';

const ACTION_ROLES = ['button', 'checkbox', 'link', 'textbox'];

function hasActionRole(element) {
  const roles = (element.getAttribute('role') || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return roles.some((role) => ACTION_ROLES.includes(role));
}

function isNativeActionElement(element) {
  const tagName = element.tagName.toLowerCase();

  if (['button', 'select', 'textarea'].includes(tagName)) {
    return true;
  }

  if (tagName === 'a') {
    return element.hasAttribute('href');
  }

  if (tagName === 'input') {
    return element.getAttribute('type')?.toLowerCase() !== 'hidden';
  }

  return false;
}

export const missingRoleActionRule = {
  id: 'missing-role-action',
  name: 'Missing role on focusable action',
  enabled: true,
  description: 'Detects elements with tabindex="0" that do not have an action role',
  check(document) {
    const issues = [];

    document.querySelectorAll('[tabindex="0"]').forEach((element) => {
      if (hasActionRole(element) || isNativeActionElement(element)) {
        return;
      }

      issues.push({
        severity: 'warning',
        rule: 'missing-role-action',
        element: getElementSignature(element),
        message: 'Focusable element does not have an action role',
        suggestion: 'Add an appropriate element (e.g., <button>, <link>) to ensure it is recognized as an interactive element.',
        line: getLineNumber(element),
      });
    });

    return issues;
  },
};

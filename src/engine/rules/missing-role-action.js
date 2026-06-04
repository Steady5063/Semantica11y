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

function createIssue(element, message) {
  return {
    severity: 'warning',
    rule: 'missing-role-action',
    element: getElementSignature(element),
    message,
    suggestion: 'Use a native action element such as <button> or <a>, or add an appropriate action role',
    line: getLineNumber(element),
  };
}

export const missingRoleActionRule = {
  id: 'missing-role-action',
  name: 'Missing role on focusable action',
  enabled: true,
  description: 'Detects non-semantic action elements that do not have an action role',
  check(document) {
    const issues = [];
    const reportedElements = new Set();

    document.querySelectorAll('[tabindex="0"]').forEach((element) => {
      if (hasActionRole(element) || isNativeActionElement(element)) {
        return;
      }

      issues.push(createIssue(element, 'Focusable element does not have an action role'));
      reportedElements.add(element);
    });

    document.querySelectorAll('[onclick]').forEach((element) => {
      if (
        reportedElements.has(element) ||
        hasActionRole(element) ||
        isNativeActionElement(element)
      ) {
        return;
      }

      issues.push({
        ...createIssue(element, 'Element has a click handler but does not have an action role'),
      });
    });

    return issues;
  },
};

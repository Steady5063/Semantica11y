import { getElementSignature, getLineNumber } from '../utils.js';

function hasDialogRole(element) {
  return (element.getAttribute('role') || '')
    .toLowerCase()
    .split(/\s+/)
    .includes('dialog');
}

export const ariaModalRule = {
  id: 'aria-modal',
  name: 'ARIA modal dialog usage',
  enabled: true,
  description: 'Detects ARIA dialog/modal usage and invalid tabindex on dialog elements',
  check(document) {
    const issues = [];

    document.querySelectorAll('[aria-modal], [role]').forEach((element) => {
      if (!element.hasAttribute('aria-modal') && !hasDialogRole(element)) {
        return;
      }

      issues.push({
        severity: 'warning',
        rule: 'aria-modal',
        element: getElementSignature(element),
        message: element.hasAttribute('aria-modal')
          ? 'Element uses aria-modal for modal dialog behavior'
          : 'Element uses ARIA dialog role instead of a native dialog element',
        suggestion: 'Consider using the native <dialog> element for modal dialogs',
        line: getLineNumber(element),
      });
    });

    document.querySelectorAll('dialog[tabindex]').forEach((dialog) => {
      issues.push({
        severity: 'error',
        rule: 'aria-modal',
        element: getElementSignature(dialog),
        message: '<dialog> element must not use tabindex',
        suggestion: 'Remove tabindex from the <dialog> element',
        line: getLineNumber(dialog),
      });
    });

    return issues;
  },
};

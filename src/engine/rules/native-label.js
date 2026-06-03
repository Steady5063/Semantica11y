import { getElementSignature, getLineNumber } from '../utils.js';

const INPUT_VALUE_LABEL_TYPES = ['button', 'reset', 'submit'];

function normalizeText(value) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function getLabelText(element, document) {
  const id = element.id;
  const explicitLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
  const wrappingLabel = element.closest('label');

  return explicitLabel?.textContent.trim() || wrappingLabel?.textContent.trim() || '';
}

function getNativeText(element, document) {
  const tagName = element.tagName.toLowerCase();

  if (['button', 'a'].includes(tagName)) {
    return element.textContent.trim();
  }

  if (tagName === 'input') {
    const type = element.getAttribute('type')?.toLowerCase() || 'text';

    if (INPUT_VALUE_LABEL_TYPES.includes(type)) {
      return element.getAttribute('value')?.trim() || '';
    }

    return getLabelText(element, document);
  }

  if (['textarea', 'select'].includes(tagName)) {
    return getLabelText(element, document);
  }

  return '';
}

export const nativeLabelRule = {
  id: 'native-label',
  name: 'Native label conflicts',
  enabled: true,
  description: 'Detects aria-label values that duplicate or conflict with native label text',
  check(document) {
    const issues = [];

    document
      .querySelectorAll('button[aria-label], a[href][aria-label], input[aria-label], textarea[aria-label], select[aria-label]')
      .forEach((element) => {
        const ariaLabel = element.getAttribute('aria-label') || '';
        const nativeText = getNativeText(element, document);

        if (!nativeText.trim()) {
          return;
        }

        const isSameLabel = normalizeText(ariaLabel) === normalizeText(nativeText);

        issues.push({
          severity: isSameLabel ? 'warning' : 'error',
          rule: 'native-label',
          element: getElementSignature(element),
          message: isSameLabel
            ? 'Unnecessary aria-label duplicates native label text'
            : 'aria-label does not match native label text',
          suggestion: isSameLabel
            ? 'Remove the aria-label and use the native label text'
            : 'Update aria-label to match the visible label, or remove it and rely on native text',
          line: getLineNumber(element),
        });
      });

    return issues;
  },
};

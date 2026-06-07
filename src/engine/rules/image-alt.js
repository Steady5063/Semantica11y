import { getElementSignature, getLineNumber } from '../utils.js';

function normalizeText(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export const imageAltRule = {
  id: 'image-alt',
  name: 'Image alternative text',
  enabled: true,
  description: 'Detects images without alt attributes and conflicting image labels',
  check(document) {
    const issues = [];

    document.querySelectorAll('img').forEach((image) => {
      const hasAlt = image.hasAttribute('alt');
      const altText = image.getAttribute('alt') || '';
      const ariaLabel = image.getAttribute('aria-label');
      const hasAriaLabel = ariaLabel !== null;

      if (!hasAlt) {
        issues.push({
          severity: 'error',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: 'Image is missing an alt attribute',
          suggestion: 'Add an alt attribute that describes the image, or use alt="" for decorative images',
          line: getLineNumber(image),
        });
      }

      if (!hasAriaLabel) {
        return;
      }

      if (!hasAlt) {
        issues.push({
          severity: 'warning',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: 'Image uses aria-label without an alt attribute',
          suggestion: 'Use the alt attribute as the image accessible name instead of aria-label',
          line: getLineNumber(image),
        });
        return;
      }

      if (altText === '') {
        issues.push({
          severity: 'warning',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: 'Image uses aria-label while alt is empty',
          suggestion: 'Remove aria-label for decorative images, or replace alt="" with meaningful alt text',
          line: getLineNumber(image),
        });
        return;
      }

      if (normalizeText(ariaLabel) !== normalizeText(altText)) {
        issues.push({
          severity: 'warning',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: 'aria-label overrides image alt text',
          suggestion: 'Remove aria-label and keep the accessible name in the alt attribute',
          line: getLineNumber(image),
        });
      }
    });

    return issues;
  },
};

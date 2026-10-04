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
      const hasAltAttribute = image.hasAttribute('alt');
      const altText = image.getAttribute('alt') || '';
      const ariaLabel = image.getAttribute('aria-label');
      const hasAriaLabel = ariaLabel !== null;

      if (!hasAltAttribute) {
        issues.push({
          severity: 'error',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: 'Image is missing an alt attribute',
          suggestion: 'Add an alt attribute that describes the image, or use alt="" for decorative images',
          line: getLineNumber(image),
        });
      }

      const decorativeAttributes = [];
      if (image.getAttribute('aria-hidden')?.trim().toLowerCase() === 'true') {
        decorativeAttributes.push('aria-hidden="true"');
      }
      if (image.getAttribute('role')?.trim().toLowerCase() === 'presentation') {
        decorativeAttributes.push('role="presentation"');
      }
      if (decorativeAttributes.length && (!hasAltAttribute || altText !== '')) {
        issues.push({
          severity: 'warning',
          rule: 'image-alt',
          element: getElementSignature(image),
          message: `Image uses ${decorativeAttributes.join(' and ')} without alt=""`,
          suggestion: 'Use alt="" for decorative images. If the image conveys information, keep meaningful alt text and remove the attributes that hide its semantics',
          line: getLineNumber(image),
        });
      }

      if (!hasAriaLabel) {
        return;
      }

      if (!hasAltAttribute) {
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

import { getLineNumber } from '../utils.js';

export const headingHierarchyRule = {
  id: 'heading-hierarchy',
  name: 'Heading hierarchy issues',
  enabled: true,
  description: 'Detects improper heading hierarchy (e.g., h1 > h3 without h2)',
  check(document) {
    const issues = [];
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    if (!document.querySelector('h1')) {
      issues.push({
        severity: 'warning',
        rule: 'heading-hierarchy',
        element: 'document',
        message: 'Page does not have an h1 heading',
        suggestion: 'Add one <h1> that describes the main topic of the page',
        line: 0,
      });
    }

    let previousLevel = 0;

    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName[1]);

      // Check for skipped levels (except first heading)
      if (previousLevel > 0 && currentLevel > previousLevel + 1) {
        issues.push({
          severity: 'warning',
          rule: 'heading-hierarchy',
          element: heading.textContent.substring(0, 50),
          message: `Heading hierarchy skipped: ${previousLevel > 0 ? `<h${previousLevel}>` : 'start'} -> <${heading.tagName.toLowerCase()}>`,
          suggestion: `Use <h${previousLevel + 1}> instead of <${heading.tagName.toLowerCase()}>`,
          line: getLineNumber(heading),
        });
      }

      previousLevel = currentLevel;
    });

    return issues;
  },
};

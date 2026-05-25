/**
 * Rule Definitions - Semantic and ARIA compliance rules
 */

/**
 * Default set of rules for semantic HTML and ARIA analysis
 */
export const DEFAULT_RULES = [
  {
    id: 'non-semantic-divs',
    name: 'Non-semantic div usage',
    enabled: true,
    description: 'Detects div elements used for layout that should use semantic elements',
    check(document) {
      const issues = [];
      const semanticRoleMappings = [
        {
          element: 'header',
          ariaRole: 'banner',
          patterns: ['header'],
          message: 'Div appears to be used for page header',
        },
        {
          element: 'footer',
          ariaRole: 'contentinfo',
          patterns: ['footer'],
          message: 'Div appears to be used for page footer',
        },
        {
          element: 'nav',
          ariaRole: 'navigation',
          patterns: ['nav'],
          message: 'Div appears to be used for navigation',
        },
        {
          element: 'main',
          ariaRole: 'main',
          patterns: ['main'],
          message: 'Div appears to be used for main content',
        },
        {
          element: 'aside',
          ariaRole: 'complementary',
          patterns: ['aside', 'sidebar'],
          message: 'Div appears to be used for complementary content',
        },
        {
          element: 'article',
          ariaRole: 'article',
          patterns: ['article', 'post'],
          message: 'Div appears to be used for article content',
        },
        {
          element: 'section',
          ariaRole: 'region',
          patterns: ['section', 'region'],
          message: 'Div appears to be used for a page section',
        },
      ];
      
      document.querySelectorAll('div').forEach((div) => {
        const className = div.className.toLowerCase();
        const id = div.id.toLowerCase();
        const roles = (div.getAttribute('role') || '')
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        semanticRoleMappings.forEach(({ element, ariaRole, patterns, message }) => {
          const hasAriaRole = roles.includes(ariaRole);
          const hasSemanticPattern = patterns.some(
            (pattern) => className.includes(pattern) || id.includes(pattern)
          );

          if (!hasAriaRole && !hasSemanticPattern) {
            return;
          }

          issues.push({
            severity: 'warning',
            rule: 'non-semantic-divs',
            element: getElementSignature(div),
            message,
            suggestion: `Consider using <${element}> semantic element instead`,
            line: getLineNumber(div),
          });
        });
      });

      return issues;
    },
  },
  {
    id: 'missing-alt-text',
    name: 'Missing alt text on images',
    enabled: true,
    description: 'Detects img elements without alt attribute',
    check(document) {
      const issues = [];

      document.querySelectorAll('img').forEach((img) => {
        const alt = img.getAttribute('alt');
        if (alt === null || alt.trim() === '') {
          issues.push({
            severity: 'error',
            rule: 'missing-alt-text',
            element: `<img src="${img.src}" />`,
            message: 'Image missing alt text',
            suggestion: 'Add descriptive alt text: alt="description of image"',
            line: getLineNumber(img),
          });
        }
      });

      return issues;
    },
  },
  {
    id: 'heading-hierarchy',
    name: 'Heading hierarchy issues',
    enabled: true,
    description: 'Detects improper heading hierarchy (e.g., h1 > h3 without h2)',
    check(document) {
      const issues = [];
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      let previousLevel = 0;

      headings.forEach((heading) => {
        const currentLevel = parseInt(heading.tagName[1]);

        // Check for skipped levels (except first heading)
        if (previousLevel > 0 && currentLevel > previousLevel + 1) {
          issues.push({
            severity: 'warning',
            rule: 'heading-hierarchy',
            element: heading.textContent.substring(0, 50),
            message: `Heading hierarchy skipped: ${previousLevel > 0 ? `<h${previousLevel}>` : 'start'} → <${heading.tagName.toLowerCase()}>`,
            suggestion: `Use <h${previousLevel + 1}> instead of <${heading.tagName.toLowerCase()}>`,
            line: getLineNumber(heading),
          });
        }

        previousLevel = currentLevel;
      });

      return issues;
    },
  },
  {
    id: 'aria-buttons',
    name: 'ARIA button usage',
    enabled: true,
    description: 'Detects elements using role="button" that should use semantic button elements',
    check(document) {
      const issues = [];

      document.querySelectorAll('[role]').forEach((element) => {
        const roles = element
          .getAttribute('role')
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        if (!roles.includes('button') || element.tagName.toLowerCase() === 'button') {
          return;
        }

        issues.push({
          severity: 'warning',
          rule: 'aria-buttons',
          element: getElementSignature(element),
          message: 'Element uses ARIA button role instead of a semantic button',
          suggestion: 'Consider using a <button> semantic element instead',
          line: getLineNumber(element),
        });
      });

      return issues;
    },
  },
  {
    id: 'missing-main-landmark',
    name: 'Missing main landmark',
    enabled: true,
    description: 'Detects pages without a main content landmark',
    check(document) {
      const issues = [];

      const hasMain = document.querySelector('main');
      const hasMainRole = document.querySelector('[role="main"]');

      if (!hasMain && !hasMainRole) {
        issues.push({
          severity: 'suggestion',
          rule: 'missing-main-landmark',
          element: '<body>',
          message: 'Page should have a main content landmark',
          suggestion: 'Wrap main content in <main> or add role="main"',
          line: 1,
        });
      }

      return issues;
    },
  },
];

/**
 * Placeholder for custom rules users might define
 */
export const CUSTOM_RULES = [];

/**
 * Helper function to get approximate line number of an element
 * (JSDOM doesn't provide line numbers, so this is a placeholder)
 */
function getLineNumber(element) {
  // In a real implementation, you might track this during DOM traversal
  return 0;
}

function getElementSignature(element) {
  const attributes = ['id', 'class', 'role']
    .map((attribute) => {
      const value = element.getAttribute(attribute);
      return value ? ` ${attribute}="${value}"` : '';
    })
    .join('');

  return `<${element.tagName.toLowerCase()}${attributes}>`;
}

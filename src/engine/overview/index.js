const NATIVE_SEMANTIC_SELECTORS = [
  'header',
  'footer',
  'nav',
  'main',
  'aside',
  'article',
  'section',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'table',
  'img',
  'p',
  'button',
  'input:not([type="hidden"])',
  'textarea',
  'select',
  'a[href]',
  'form',
  'label',
];

const ROLE_SEMANTIC_MATCHERS = [
  { role: 'banner', matches: (element) => element.tagName.toLowerCase() === 'header' },
  { role: 'contentinfo', matches: (element) => element.tagName.toLowerCase() === 'footer' },
  { role: 'navigation', matches: (element) => element.tagName.toLowerCase() === 'nav' },
  { role: 'main', matches: (element) => element.tagName.toLowerCase() === 'main' },
  { role: 'complementary', matches: (element) => element.tagName.toLowerCase() === 'aside' },
  { role: 'article', matches: (element) => element.tagName.toLowerCase() === 'article' },
  { role: 'region', matches: (element) => element.tagName.toLowerCase() === 'section' },
  { role: 'heading', matches: (element) => /^h[1-6]$/i.test(element.tagName) },
  { role: 'list', matches: (element) => ['ul', 'ol'].includes(element.tagName.toLowerCase()) },
  { role: 'listitem', matches: (element) => element.tagName.toLowerCase() === 'li' },
  { role: 'table', matches: (element) => element.tagName.toLowerCase() === 'table' },
  { role: 'img', matches: (element) => element.tagName.toLowerCase() === 'img' },
  { role: 'paragraph', matches: (element) => element.tagName.toLowerCase() === 'p' },
  { role: 'button', matches: (element) => element.tagName.toLowerCase() === 'button' },
  {
    role: 'checkbox',
    matches: (element) =>
      element.tagName.toLowerCase() === 'input' &&
      element.getAttribute('type')?.toLowerCase() === 'checkbox',
  },
  { role: 'link', matches: (element) => element.tagName.toLowerCase() === 'a' },
  {
    role: 'textbox',
    matches: (element) => {
      const tagName = element.tagName.toLowerCase();
      const type = element.getAttribute('type')?.toLowerCase() || 'text';

      return tagName === 'textarea' || (tagName === 'input' && type === 'text');
    },
  },
];

function getRoles(element) {
  return (element.getAttribute('role') || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function getGrade(nativeCount, customCount) {
  const total = nativeCount + customCount;

  if (total === 0) {
    return 'N/A';
  }

  const nativeRatio = nativeCount / total;

  if (nativeRatio >= 0.9) return 'A';
  if (nativeRatio >= 0.75) return 'B';
  if (nativeRatio >= 0.6) return 'C';
  if (nativeRatio >= 0.4) return 'D';
  return 'F';
}

function isCustomSemanticElement(element) {
  const roles = getRoles(element);
  const hasNoRole = roles.length === 0;
  const hasCustomBehavior =
    element.getAttribute('tabindex') === '0' || element.hasAttribute('onclick');
  const isNativeSemanticElement = element.matches(NATIVE_SEMANTIC_SELECTORS.join(','));

  if (
    roles.some((role) =>
      ROLE_SEMANTIC_MATCHERS.some(
        (matcher) => matcher.role === role && !matcher.matches(element)
      )
    )
  ) {
    return true;
  }

  return hasNoRole && hasCustomBehavior && !isNativeSemanticElement;
}

export function createSemanticOverview(document) {
  const nativeElements = Array.from(
    document.querySelectorAll(NATIVE_SEMANTIC_SELECTORS.join(','))
  );
  const customElements = Array.from(
    document.querySelectorAll('[role], [tabindex="0"], [onclick]')
  ).filter(isCustomSemanticElement);
  const total = nativeElements.length + customElements.length;
  const semanticRatio = total > 0 ? nativeElements.length / total : null;

  return {
    nativeSemanticElements: nativeElements.length,
    customSemanticElements: customElements.length,
    totalSemanticCandidates: total,
    semanticRatio,
    grade: getGrade(nativeElements.length, customElements.length),
  };
}

export function formatSemanticOverview(overview) {
  const ratio =
    overview.semanticRatio === null
      ? 'N/A'
      : `${Math.round(overview.semanticRatio * 100)}%`;

  return [
    'Semantic Overview',
    '-------------------------------',
    `Native semantic elements: ${overview.nativeSemanticElements}`,
    `ARIA/custom non-semantic components: ${overview.customSemanticElements}`,
    `Native semantic ratio: ${ratio}`,
    `Grade: ${overview.grade}`,
  ].join('\n');
}

export function printSemanticOverview(overview) {
  const report = formatSemanticOverview(overview);
  console.log(report);
  return report;
}

function tagName(element) {
  return element.tagName.toLowerCase();
}

export const ARIA_STRUCTURE_ROLE_MAPPINGS = [
  {
    role: 'article',
    semanticElement: '<article>',
    isSemanticMatch: (element) => tagName(element) === 'article',
  },
  {
    role: 'blockquote',
    semanticElement: '<blockquote>',
    isSemanticMatch: (element) => tagName(element) === 'blockquote',
  },
  {
    role: 'caption',
    semanticElement: '<caption>',
    isSemanticMatch: (element) => tagName(element) === 'caption',
  },
  {
    role: 'cell',
    semanticElement: '<td>',
    isSemanticMatch: (element) => tagName(element) === 'td',
  },
  {
    role: 'code',
    semanticElement: '<code>',
    isSemanticMatch: (element) => tagName(element) === 'code',
  },
  {
    role: 'columnheader',
    semanticElement: '<th scope="col">',
    isSemanticMatch: (element) => tagName(element) === 'th',
  },
  {
    role: 'definition',
    semanticElement: '<dfn>',
    isSemanticMatch: (element) => tagName(element) === 'dfn',
  },
  {
    role: 'deletion',
    semanticElement: '<del>',
    isSemanticMatch: (element) => tagName(element) === 'del',
  },
  {
    role: 'emphasis',
    semanticElement: '<em>',
    isSemanticMatch: (element) => tagName(element) === 'em',
  },
  {
    role: 'figure',
    semanticElement: '<figure>',
    isSemanticMatch: (element) => tagName(element) === 'figure',
  },
  {
    role: 'generic',
    semanticElement: 'a more specific semantic element or remove role="generic"',
    isSemanticMatch: () => false,
  },
  {
    role: 'heading',
    semanticElement: '<h1> through <h6>',
    isSemanticMatch: (element) => /^h[1-6]$/i.test(element.tagName),
  },
  {
    role: 'img',
    semanticElement: '<img>',
    isSemanticMatch: (element) => tagName(element) === 'img',
  },
  {
    role: 'list',
    semanticElement: '<ul> or <ol>',
    isSemanticMatch: (element) => ['ul', 'ol'].includes(tagName(element)),
  },
  {
    role: 'listitem',
    semanticElement: '<li>',
    isSemanticMatch: (element) => tagName(element) === 'li',
  },
  {
    role: 'paragraph',
    semanticElement: '<p>',
    isSemanticMatch: (element) => tagName(element) === 'p',
  },
  {
    role: 'row',
    semanticElement: '<tr>',
    isSemanticMatch: (element) => tagName(element) === 'tr',
  },
  {
    role: 'rowgroup',
    semanticElement: '<thead>, <tbody>, or <tfoot>',
    isSemanticMatch: (element) => ['thead', 'tbody', 'tfoot'].includes(tagName(element)),
  },
  {
    role: 'rowheader',
    semanticElement: '<th scope="row">',
    isSemanticMatch: (element) => tagName(element) === 'th',
  },
  {
    role: 'separator',
    semanticElement: '<hr>',
    isSemanticMatch: (element) => tagName(element) === 'hr',
  },
  {
    role: 'strong',
    semanticElement: '<strong>',
    isSemanticMatch: (element) => tagName(element) === 'strong',
  },
  {
    role: 'subscript',
    semanticElement: '<sub>',
    isSemanticMatch: (element) => tagName(element) === 'sub',
  },
  {
    role: 'superscript',
    semanticElement: '<sup>',
    isSemanticMatch: (element) => tagName(element) === 'sup',
  },
  {
    role: 'table',
    semanticElement: '<table>',
    isSemanticMatch: (element) => tagName(element) === 'table',
  },
  {
    role: 'term',
    semanticElement: '<dt>',
    isSemanticMatch: (element) => tagName(element) === 'dt',
  },
  {
    role: 'time',
    semanticElement: '<time>',
    isSemanticMatch: (element) => tagName(element) === 'time',
  },
];

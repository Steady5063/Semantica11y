<img src="./Semantically-logo.png" alt="Semantica11y logo" width="500" height="350">

# Semantica11y

A JavaScript analysis engine for checking webpages (HTML) for ARIA compliance and non-semantic HTML elements with intelligent suggestions for semantic improvements.

## 🎯 Purpose

Semantica11y helps developers and accessibility professionals:
- Identify non-semantic HTML elements that should use semantic alternatives
- Detect missing ARIA labels and accessibility attributes
- Validate heading hierarchy and semantic structure
- Get actionable suggestions for improving web accessibility (a11y)
- Ensure compliance with WCAG and modern web standards

## ✨ Features

- **Semantic Analysis**: Detects divs/spans used for structural layout
- **ARIA Validation**: Checks for missing labels and ARIA attributes
- **Heading Hierarchy**: Validates proper heading structure
- **Form Accessibility**: Ensures inputs are properly labeled
- **Landmark Detection**: Verifies presence of main content landmarks
- **Extensible Rules Engine**: Add custom rules for your specific needs
- **Detailed Reporting**: Comprehensive analysis with severity levels and suggestions

## 📦 Installation

```bash
npm install semantica11y
```

## 🚀 Quick Start

```javascript
import { Analyzer } from 'semantica11y';

const analyzer = new Analyzer();

const html = `
  <html>
    <body>
      <div role="banner">Header</div>
      <img src="logo.png" />
      <form>
        <input type="text" id="name" />
      </form>
    </body>
  </html>
`;

const results = await analyzer.analyzeHTML(html);
console.log(analyzer.formatResults(results));
```

## 📖 Usage

### Basic Analysis

```javascript
import { Analyzer } from 'semantica11y';

const analyzer = new Analyzer();

// Analyze HTML string
const results = await analyzer.analyzeHTML(htmlString, 'https://example.com');

// Get formatted output
console.log(analyzer.formatResults(results));
```

### Analyze from File

```javascript
const results = await analyzer.analyzeFile('./index.html');
```

### Access Raw Results

```javascript
const results = await analyzer.analyzeHTML(html);
console.log(results);
/*
{
  url: 'https://example.com',
  timestamp: '2024-01-15T10:30:00Z',
  summary: {
    total: 5,
    errors: 2,
    warnings: 2,
    suggestions: 1
  },
  issues: [
    {
      severity: 'warning',
      rule: 'aria-landmarks',
      element: '<div role="navigation">',
      message: 'Element appears to be used for navigation',
      suggestion: 'Consider using <nav> semantic element instead'
    },
    // ... more issues
  ]
}
*/
```

### Reports

```javascript
import { Analyzer, exportTextReport, formatConsoleReport } from 'semantica11y';

const analyzer = new Analyzer();
const results = await analyzer.analyzeHTML(html);

console.log(formatConsoleReport(results));
await exportTextReport(results, './semantica11y-report.txt');
```

### Custom Rules

```javascript
const customRules = [
  {
    id: 'custom-rule',
    name: 'My Custom Rule',
    enabled: true,
    description: 'Custom accessibility check',
    check(document) {
      const issues = [];
      // Your custom check logic
      return issues;
    }
  }
];

const analyzer = new Analyzer({ rules: customRules });
```

## 📋 Default Rules

### 1. **aria-landmarks**
Detects elements using ARIA landmark roles that should use semantic elements.
- Severity: Warning
- Suggestion: Use `<header>`, `<footer>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`

### 2. **missing-form-labels**
Detects form inputs without proper labels.
- Severity: Error
- Suggestion: Associate label with input using `for` attribute or ARIA

### 3. **heading-hierarchy**
Validates heading structure (H1 → H2 → H3, etc.) and checks that the page has an H1.
- Severity: Warning
- Suggestion: Fix skipped heading levels and add one `<h1>` for the main page topic

### 4. **aria-actions**
Detects elements using ARIA action roles that should use semantic elements, including mismatched ARIA roles on native action elements.
- Severity: Warning
- Suggestion: Use semantic controls such as `<button>`, `<input type="checkbox">`, `<a>`, `<input>`, or `<textarea>`

### 5. **missing-key-landmark**
Checks for main, navigation, footer, and page heading structure, whether built with semantic elements or ARIA roles.
- Severity: Suggestion
- Suggestion: Add missing structure such as `<main>`, `<nav>`, `<footer>`, a heading, or matching ARIA roles

### 6. **aria-structure**
Detects elements using ARIA structure roles that should use semantic elements.
- Severity: Warning
- Suggestion: Use semantic structure such as `<article>`, `<blockquote>`, `<caption>`, `<td>`, `<code>`, `<th scope="col">`, `<dfn>`, `<del>`, `<em>`, `<figure>`, `<h1>` through `<h6>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<img>`, `<p>`, `<tr>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th scope="row">`, `<hr>`, `<strong>`, `<sub>`, `<sup>`, `<dt>`, or `<time>`

### 7. **missing-role-action**
Detects non-semantic action elements with `tabindex="0"` or click handlers that do not have an action role.
- Severity: Warning
- Suggestion: Use native controls such as `<button>` or `<a>`, or add an appropriate action role

### 8. **native-label**
Detects native action elements with `aria-label` values that duplicate or completely differ from native label text.
- Severity: Warning for duplicate labels, Error for unrelated labels
- Suggestion: Remove unnecessary `aria-label` values or make sure they include the visible/native label text. Helper text such as "opens in a new window" or "opens in new window" is allowed.

### 9. **image-alt**
Detects images missing `alt` attributes and images where `aria-label` conflicts with or replaces `alt`.
- Severity: Error for missing `alt`, Warning for `aria-label` with no `alt`, `aria-label` with `alt=""`, or `aria-label` overriding `alt` text
- Suggestion: Put image alternative text in `alt`, use `alt=""` only for decorative images, and avoid `aria-label` on images

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run examples:

```bash
npm run example
```

## 📦 Build Package

Create a clean package directory:

```bash
npm run build
```

Create a tarball from the build output:

```bash
npm pack ./dist
```

## 🏗️ Project Structure

```
semantica11y/
├── src/
│   ├── index.js           # Main export
│   ├── analyzer.js        # Core analyzer class
│   └── engine/
│       ├── index.js       # RuleEngine class
│       ├── definitions.js # Default rule registry
│       ├── reporter/      # Report formatting and exporting
│       ├── rules/         # Individual rule definitions
│       ├── semantic-role-mappings.js
│       └── utils.js
├── examples/
│   └── basic.js          # Usage example
├── test/
│   ├── analyzer.test.js  # Analyzer tests
│   └── rules.test.js     # RuleEngine tests
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🔗 Resources

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantic_HTML)
- [Web Accessibility](https://www.w3.org/WAI/)

## 📞 Support

For issues, questions, or suggestions, please create an issue in the repository.

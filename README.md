![Semantica11y logo](./Semantically-logo.png)

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
      <div id="header">Header</div>
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
      severity: 'error',
      rule: 'missing-alt-text',
      element: '<img src="logo.png" />',
      message: 'Image missing alt text',
      suggestion: 'Add descriptive alt text: alt="description of image"'
    },
    // ... more issues
  ]
}
*/
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

### 1. **non-semantic-divs**
Detects divs used for structural purposes (header, footer, nav) that should use semantic elements.
- Severity: Warning
- Suggestion: Use `<header>`, `<footer>`, `<nav>`, `<main>`, `<article>`, `<section>`

### 2. **missing-alt-text**
Detects images without alt text.
- Severity: Error
- Suggestion: Add descriptive alt attribute

### 3. **missing-form-labels**
Detects form inputs without proper labels.
- Severity: Error
- Suggestion: Associate label with input using `for` attribute or ARIA

### 4. **heading-hierarchy**
Validates heading structure (H1 → H2 → H3, etc.).
- Severity: Warning
- Suggestion: Fix skipped heading levels

### 5. **aria-buttons**
Detects elements using `role="button"` that should use semantic buttons.
- Severity: Warning
- Suggestion: Use `<button>`

### 6. **missing-main-landmark**
Checks for main content landmark.
- Severity: Suggestion
- Suggestion: Add `<main>` or `role="main"`

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

## 🏗️ Project Structure

```
semantica11y/
├── src/
│   ├── index.js           # Main export
│   ├── analyzer.js        # Core analyzer class
│   └── rules/
│       ├── index.js       # RuleEngine class
│       └── definitions.js # Default rule definitions
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

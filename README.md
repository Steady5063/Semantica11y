<img src="Semantically-logo.png" alt="Semantica11y logo" width="500" height="350">

# Semantica11y

A JavaScript analysis engine for checking webpages (HTML) for non-semantic HTML elements with ARIA using intelligent suggestions for semantic improvements. 

## 🎯 Purpose

Using semantic and native HTML elements is the foundation to building an accessible webpage. Semantica11y is here to help ensure that when you build your web applications, it is build semantically first, for better accessibility and long term code sustainability!

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

Semantica11y ships with 11 default rules that check semantic HTML, ARIA usage, headings, landmarks, forms, images, disclosure controls, modal dialogs, and native label conflicts.

For the full rule-by-rule reference, see [src/engine/rules/README.md](src/engine/rules/README.md).

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run the Playwright example against `https://example.com`:

```bash
node examples/basic.js
```

Analyze a different page:

```bash
node examples/basic.js https://www.statefarm.com
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

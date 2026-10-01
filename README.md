<img src="https://media.licdn.com/dms/image/v2/D5622AQGesCZdmU6big/feedshare-shrink_800/B56Z5fRmg6KcAc-/0/1779714910497?e=2147483647&v=beta&t=WrvuX6KsIjAy6aVgzPf3C9K27W5CL3CiR4ngtqHKvJc" alt="Semantica11y logo" width="500" height="350">

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

### Configuration (1.1.1)

Configure shared defaults once before creating analyzers:

```javascript
import { Analyzer, configure, resetConfig } from 'semantica11y';

configure({
  severities: ['error'], // Report errors only
  enabledRules: ['image-alt', 'missing-form-labels'],
  experimental: false,
});

const analyzer = new Analyzer();
const results = await analyzer.analyzeHTML(htmlString);

// Instance options override shared defaults.
const disclosures = new Analyzer({
  enabledRules: ['aria-expanded'],
  severities: ['warning'],
  experimental: true,
});

resetConfig(); // Restore defaults for future instances
```

| Option | Default | Behavior |
| --- | --- | --- |
| `severities` | `['error', 'warning', 'suggestion']` | Include only these finding severities; `[]` returns no findings. |
| `enabledRules` | `null` | Run all eligible rules, or only the listed rule IDs; `[]` runs none. |
| `experimental` | `false` | Opt into experimental rules, currently `aria-expanded`. |
| `includeWarnings` | `true` | Set to `false` to exclude warnings while retaining selected errors and suggestions. |

Rule selection controls which checks execute. Severity filtering applies to the
findings because a single rule can produce multiple severities. Summary counts
and reports reflect the filtered findings. Experimental rules require
`experimental: true` even when listed in `enabledRules`; rules with
`enabled: false` remain disabled. Unknown rule IDs match no rules.

Shared settings are copied when an instance is created; later configuration
changes do not affect existing instances. Custom rules continue to be appended
using `rules` and follow the same filters; mark a custom rule with
`experimental: true` to require opt-in. Direct engine users can pass options as
`new RuleEngine(customRules, options)`; engines also inherit shared defaults.

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

Semantica11y ships with 11 built-in rules (10 enabled by default and one experimental rule) that check semantic HTML, ARIA usage, headings, landmarks, forms, images, disclosure controls, modal dialogs, and native label conflicts.

For the full rule-by-rule reference, see [src/engine/rules/README.md](https://github.com/Steady5063/Semantica11y/tree/main/src/engine/rules).

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

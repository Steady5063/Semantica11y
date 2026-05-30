# Development Guide

This guide explains the architecture and how to develop features for Semantica11y.

## Architecture Overview

Semantica11y follows a modular architecture with three main components:

### 1. Analyzer (`src/analyzer.js`)
The main entry point for users. Responsibilities:
- Accepts HTML input (string or file)
- Coordinates analysis using RuleEngine
- Formats and returns results
- Provides convenient formatting methods

### 2. RuleEngine (`src/engine/index.js`)
Orchestrates rule execution. Responsibilities:
- Manages collection of analysis rules
- Executes rules against DOM documents
- Aggregates results with summary statistics
- Allows adding custom rules

### 3. Rules (`src/engine/rules`)
Collection of analysis checks, registered in `src/engine/definitions.js`. Each rule:
- Defines an analysis pattern (non-semantic divs, missing labels, etc.)
- Takes a DOM document and returns issues found
- Includes severity level and suggestions

## Rule System

### How Rules Work

1. Each rule defines a `check(document)` function
2. The function traverses the DOM looking for issues
3. Returns an array of issue objects:
   ```javascript
   {
     severity: 'error' | 'warning' | 'suggestion',
     rule: 'rule-id',
     element: 'HTML snippet',
     message: 'Human-readable message',
     suggestion: 'How to fix it'
   }
   ```

### Adding a New Rule

Example: Add a rule to detect tables without headers

```javascript
{
  id: 'table-headers',
  name: 'Tables without headers',
  enabled: true,
  description: 'Detects table elements that lack proper headers',
  check(document) {
    const issues = [];
    
    document.querySelectorAll('table').forEach((table) => {
      const hasHeaders = table.querySelector('th') || 
                        table.querySelector('[role="columnheader"]');
      
      if (!hasHeaders) {
        issues.push({
          severity: 'error',
          rule: 'table-headers',
          element: '<table>',
          message: 'Table is missing header cells',
          suggestion: 'Use <th> elements or role="columnheader" for table headers'
        });
      }
    });
    
    return issues;
  }
}
```

## Data Flow

```
User Input (HTML)
    ↓
Analyzer.analyzeHTML()
    ↓
JSDOM (Parse HTML → DOM)
    ↓
RuleEngine.analyze()
    ↓
For each Rule:
  - Call rule.check(document)
  - Collect issues
    ↓
Aggregate Results & Summary
    ↓
Return Results Object
```

## Testing Strategy

### Unit Tests
- Test individual rules in isolation
- Mock DOM structures
- Verify issue detection and messages

Example:
```javascript
test('Analyzer - Detect ARIA landmarks', async () => {
  const analyzer = new Analyzer();
  const html = '<div role="navigation">Menu</div>';
  const results = await analyzer.analyzeHTML(html);
  const issues = results.issues.filter(i => i.rule === 'aria-landmarks');
  assert.ok(issues.length > 0);
});
```

### Running Tests
```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode for development
```

## Future Enhancements

### Potential Rules to Add
- [ ] Color contrast validation
- [ ] Form placeholder vs label detection
- [ ] Missing skip links
- [ ] Keyboard navigation issues
- [ ] Video/audio without captions
- [ ] Focus management
- [ ] Lang attribute detection

### Architectural Improvements
- [ ] Add line number tracking for better error reporting
- [ ] Implement rule severity customization
- [ ] Add performance metrics
- [ ] Create browser API for real-time checking
- [ ] Add CLI tool integration
- [ ] Export results to JSON/HTML reports

### Documentation Needs
- [ ] API documentation with examples
- [ ] Rule development tutorial
- [ ] Integration guides (npm, CDN, etc.)
- [ ] Video walkthroughs

## Performance Considerations

- Rules should be efficient DOM traversals
- Avoid creating new large data structures
- Use NodeList/querySelectorAll appropriately
- Consider rule execution order (expensive last)

## Debugging

### Enable Debug Logging
Add console statements in rule checks:
```javascript
console.log('Checking rule:', rule.id, 'for', element.tagName);
```

### Inspect DOM
Use browser console or Node.js inspection:
```javascript
const dom = new JSDOM(html);
console.log(dom.window.document.documentElement.outerHTML);
```

## Project Standards

- **Spacing**: 2 spaces
- **Language**: ES2020+
- **Module System**: ESM only
- **No external dependencies** except jsdom
- **JSDoc comments** for public APIs
- **Semantic commits** (feat:, fix:, test:, docs:)

## Getting Help

- Check existing tests for examples
- Review rule definitions for patterns
- Look at CONTRIBUTING.md for guidelines

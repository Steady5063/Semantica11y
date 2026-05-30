# Contributing to Semantica11y

We love your input! We want to make contributing to this project as easy and transparent as possible.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a feature branch: `git checkout -b feature/your-feature`

## Making Changes

1. Make your changes in the `src/` directory
2. Add tests in the `test/` directory for new functionality
3. Run tests: `npm test`
4. Ensure all tests pass before submitting a PR

## Adding New Rules

To add a new analysis rule:

1. Create a rule file in [src/engine/rules](src/engine/rules)
2. Add the rule to [src/engine/definitions.js](src/engine/definitions.js)
3. Add tests for the new rule in [test/rules.test.js](test/rules.test.js) or [test/analyzer.test.js](test/analyzer.test.js)
4. Update the README with the new rule description
5. Submit a PR with your changes

### Rule Structure

```javascript
{
  id: 'rule-id',
  name: 'Human-readable name',
  enabled: true,
  description: 'What this rule checks',
  check(document) {
    const issues = [];
    // Your implementation here
    return issues;
  }
}
```

## Testing

- Write unit tests for new features
- Use Node's built-in test runner (no external dependencies needed)
- Run `npm test` to execute all tests

## Code Style

- Use 2 spaces for indentation
- Use ES modules (import/export)
- Add JSDoc comments for public APIs
- Keep functions focused and testable

## Pull Requests

1. Fork the repository
2. Create your feature branch
3. Make your changes and add tests
4. Ensure tests pass: `npm test`
5. Submit a pull request with a clear description

## Reporting Issues

Please use GitHub Issues to report bugs or suggest features. Include:
- Clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Code sample if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

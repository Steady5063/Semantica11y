/**
 * Unit tests for Analyzer class
 */

import test from 'node:test';
import assert from 'node:assert';
import { Analyzer } from '../src/index.js';

test('Analyzer - Basic instantiation', () => {
  const analyzer = new Analyzer();
  assert.ok(analyzer, 'Analyzer should be created');
  assert.ok(analyzer.ruleEngine, 'RuleEngine should be initialized');
});

test('Analyzer - Detect missing alt text', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><img src="test.png" /></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const altTextIssues = results.issues.filter(
    (i) => i.rule === 'missing-alt-text'
  );

  assert.ok(altTextIssues.length > 0, 'Should find missing alt text');
});

test('Analyzer - Detect non-semantic divs', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><div id="header">Header</div></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const divIssues = results.issues.filter((i) => i.rule === 'non-semantic-divs');

  assert.ok(divIssues.length > 0, 'Should find non-semantic divs');
});

test('Analyzer - Detect non-semantic divs with ARIA landmark roles', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div role="banner">Header</div>
        <div role="navigation">Nav</div>
        <div role="main">Main</div>
        <div role="complementary">Aside</div>
        <div role="contentinfo">Footer</div>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const divIssues = results.issues.filter((i) => i.rule === 'non-semantic-divs');

  assert.equal(divIssues.length, 5, 'Should find divs using semantic ARIA roles');
  assert.ok(
    divIssues.some((issue) => issue.suggestion.includes('<footer>')),
    'Should suggest footer for contentinfo role'
  );
  assert.ok(
    divIssues.some((issue) => issue.suggestion.includes('<nav>')),
    'Should suggest nav for navigation role'
  );
});

test('Analyzer - Detect missing form labels', async () => {
  const analyzer = new Analyzer();
  const html =
    '<html><body><form><input type="text" id="email" /></form></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const labelIssues = results.issues.filter((i) => i.rule === 'missing-form-labels');

  assert.ok(labelIssues.length > 0, 'Should find missing form labels');
});

test('Analyzer - Detect heading hierarchy issues', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><h1>Title</h1><h3>Subtitle</h3></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const headingIssues = results.issues.filter(
    (i) => i.rule === 'heading-hierarchy'
  );

  assert.ok(headingIssues.length > 0, 'Should find heading hierarchy issues');
});

test('Analyzer - Detect ARIA buttons', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><div role="button">Save</div></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const buttonIssues = results.issues.filter((i) => i.rule === 'aria-buttons');

  assert.equal(buttonIssues.length, 1, 'Should find ARIA button usage');
  assert.equal(
    buttonIssues[0].suggestion,
    'Consider using a <button> semantic element instead'
  );
});

test('Analyzer - Format results', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><img src="test.png" /></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const formatted = analyzer.formatResults(results);

  assert.ok(formatted.includes('Semantica11y'), 'Should format as report');
  assert.ok(formatted.includes('Issues Found'), 'Should show issues section');
});

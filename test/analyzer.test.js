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

test('Analyzer - Detect ARIA landmarks', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><div role="banner">Header</div></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const divIssues = results.issues.filter((i) => i.rule === 'aria-landmarks');

  assert.ok(divIssues.length > 0, 'Should find elements with ARIA landmark roles');
});

test('Analyzer - Ignores elements without ARIA landmark roles', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><div id="header">Header</div></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const divIssues = results.issues.filter((i) => i.rule === 'aria-landmarks');

  assert.equal(divIssues.length, 0, 'Should ignore id and class naming patterns');
});

test('Analyzer - Detect ARIA landmark roles', async () => {
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
  const divIssues = results.issues.filter((i) => i.rule === 'aria-landmarks');

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

test('Analyzer - Detect missing key landmarks', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><p>Content</p></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const landmarkIssues = results.issues.filter(
    (i) => i.rule === 'missing-key-landmark'
  );

  assert.equal(landmarkIssues.length, 3, 'Should find missing main, nav, and footer landmarks');
  assert.ok(
    landmarkIssues.some((issue) => issue.suggestion.includes('role="navigation"')),
    'Should suggest ARIA navigation as an option'
  );
  assert.ok(
    landmarkIssues.some((issue) => issue.suggestion.includes('<main>')),
    'Should suggest semantic main as an option'
  );
});

test('Analyzer - Accept semantic and ARIA key landmarks', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div role="navigation">Nav</div>
        <main>Main</main>
        <footer>Footer</footer>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const landmarkIssues = results.issues.filter(
    (i) => i.rule === 'missing-key-landmark'
  );

  assert.equal(
    landmarkIssues.length,
    0,
    'Should accept main, nav, and footer from semantic elements or ARIA roles'
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

test('Analyzer - Detect ARIA actions', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div role="button">Save</div>
        <div role="checkbox" aria-checked="false">Subscribe</div>
        <span role="link">Read more</span>
        <div role="textbox" contenteditable="true">Name</div>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const actionIssues = results.issues.filter((i) => i.rule === 'aria-actions');

  assert.equal(actionIssues.length, 4, 'Should find ARIA action roles');
  assert.ok(
    actionIssues.some((issue) => issue.suggestion.includes('<button>')),
    'Should suggest button for button role'
  );
  assert.ok(
    actionIssues.some((issue) => issue.suggestion.includes('<input type="checkbox">')),
    'Should suggest checkbox input for checkbox role'
  );
  assert.ok(
    actionIssues.some((issue) => issue.suggestion.includes('<a>')),
    'Should suggest anchor for link role'
  );
  assert.ok(
    actionIssues.some((issue) => issue.suggestion.includes('<input> or <textarea>')),
    'Should suggest input or textarea for textbox role'
  );
});

test('Analyzer - Ignores semantic ARIA action elements', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <button role="button">Save</button>
        <input type="checkbox" role="checkbox" />
        <a href="/more" role="link">Read more</a>
        <textarea role="textbox"></textarea>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const actionIssues = results.issues.filter((i) => i.rule === 'aria-actions');

  assert.equal(actionIssues.length, 0, 'Should ignore semantic action elements');
});

test('Analyzer - Detect ARIA structure', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div role="heading" aria-level="2">Title</div>
        <div role="list">
          <div role="listitem">One</div>
        </div>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const structureIssues = results.issues.filter((i) => i.rule === 'aria-structure');

  assert.equal(structureIssues.length, 3, 'Should find ARIA structure roles');
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<h1> through <h6>')),
    'Should suggest heading elements for heading role'
  );
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<ul> or <ol>')),
    'Should suggest list elements for list role'
  );
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<li>')),
    'Should suggest li for listitem role'
  );
});

test('Analyzer - Ignores semantic ARIA structure elements', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <h2 role="heading">Title</h2>
        <ul role="list">
          <li role="listitem">One</li>
        </ul>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const structureIssues = results.issues.filter((i) => i.rule === 'aria-structure');

  assert.equal(structureIssues.length, 0, 'Should ignore semantic structure elements');
});

test('Analyzer - Format results', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><img src="test.png" /></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const formatted = analyzer.formatResults(results);

  assert.ok(formatted.includes('Semantica11y'), 'Should format as report');
  assert.ok(formatted.includes('Issues Found'), 'Should show issues section');
});

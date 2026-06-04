/**
 * Unit tests for Analyzer class
 */

import test from 'node:test';
import assert from 'node:assert';
import { mkdtemp, readFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import {
  Analyzer,
  exportTextReport,
  formatConsoleReport,
  formatSemanticOverview,
} from '../src/index.js';

test('Analyzer - Basic instantiation', () => {
  const analyzer = new Analyzer();
  assert.ok(analyzer, 'Analyzer should be created');
  assert.ok(analyzer.ruleEngine, 'RuleEngine should be initialized');
});

test('Analyzer - Creates semantic overview', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <header>Header</header>
        <main>
          <h1>Title</h1>
          <p>Body</p>
          <div role="navigation">Custom nav</div>
          <div role="button" tabindex="0">Custom action</div>
          <div tabindex="0">Focusable custom component</div>
          <span onclick="openMenu()">Clickable custom component</span>
          <button onclick="save()">Native action</button>
        </main>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);

  assert.equal(results.overview.nativeSemanticElements, 5);
  assert.equal(results.overview.customSemanticElements, 4);
  assert.equal(results.overview.totalSemanticCandidates, 9);
  assert.equal(results.overview.grade, 'D');
});

test('Analyzer - Counts no-role focus and click elements in semantic overview', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <main>
          <h1>Title</h1>
          <div tabindex="0">Focusable custom component</div>
          <span onclick="openMenu()">Clickable custom component</span>
          <div tabindex="0" onclick="submit()">Focusable clickable custom component</div>
          <button tabindex="0" onclick="save()">Native action</button>
        </main>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);

  assert.equal(results.overview.nativeSemanticElements, 3);
  assert.equal(results.overview.customSemanticElements, 3);
  assert.equal(results.overview.totalSemanticCandidates, 6);
});

test('Analyzer - Formats semantic overview', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><main><h1>Title</h1></main></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const overviewReport = formatSemanticOverview(results.overview);
  const formattedResults = analyzer.formatResults(results);

  assert.ok(overviewReport.includes('Native semantic elements: 2'));
  assert.ok(overviewReport.includes('Grade: A'));
  assert.ok(formattedResults.includes('Semantic Overview'));
  assert.ok(!formattedResults.includes('Semantica11y Semantic Overview'));
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

  assert.equal(landmarkIssues.length, 4, 'Should find missing main, nav, footer, and heading');
  assert.ok(
    landmarkIssues.some((issue) => issue.suggestion.includes('<nav>')),
    'Should suggest semantic navigation as an option'
  );
  assert.ok(
    landmarkIssues.some((issue) => issue.suggestion.includes('<main>')),
    'Should suggest semantic main as an option'
  );
  assert.ok(
    landmarkIssues.some((issue) => issue.suggestion.includes('<h1> through <h6>')),
    'Should suggest semantic heading as an option'
  );
});

test('Analyzer - Accept semantic key landmarks and heading', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <h1>Title</h1>
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
    'Should accept main, nav, footer, and heading from semantic elements or ARIA roles'
  );
});

test('Analyzer - Accept ARIA heading for missing key landmarks', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div role="heading" aria-level="1">Title</div>
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

  assert.equal(landmarkIssues.length, 0, 'Should accept role="heading" as a page heading');
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

test('Analyzer - Detect ARIA action role overrides on native elements', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <a href="/submit" role="button">Submit</a>
        <button role="link">Read more</button>
        <input type="checkbox" role="button" />
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const actionIssues = results.issues.filter((i) => i.rule === 'aria-actions');

  assert.equal(actionIssues.length, 3, 'Should find mismatched native and ARIA action roles');
  assert.ok(
    actionIssues.some((issue) =>
      issue.message.includes('Native link element has mismatched ARIA button role')
    ),
    'Should call out link overridden as button'
  );
  assert.ok(
    actionIssues.every((issue) => issue.suggestion.includes('Remove role=')),
    'Should suggest removing the mismatched role'
  );
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
        <div role="table">Data</div>
        <div role="img" aria-label="Chart"></div>
        <div role="paragraph">Body copy</div>
        <div role="generic">Generic wrapper</div>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const structureIssues = results.issues.filter((i) => i.rule === 'aria-structure');

  assert.equal(structureIssues.length, 7, 'Should find ARIA structure roles');
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
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<table>')),
    'Should suggest table for table role'
  );
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<img>')),
    'Should suggest img for img role'
  );
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('<p>')),
    'Should suggest p for paragraph role'
  );
  assert.ok(
    structureIssues.some((issue) => issue.suggestion.includes('remove role="generic"')),
    'Should suggest removing generic role'
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
        <table role="table"></table>
        <img role="img" alt="Chart" />
        <p role="paragraph">Body copy</p>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const structureIssues = results.issues.filter((i) => i.rule === 'aria-structure');

  assert.equal(structureIssues.length, 0, 'Should ignore semantic structure elements');
});

test('Analyzer - Detect missing role action', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div tabindex="0">Save</div>
        <span tabindex="0" role="heading">Title</span>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const roleIssues = results.issues.filter((i) => i.rule === 'missing-role-action');

  assert.equal(roleIssues.length, 2, 'Should find focusable elements without action roles');
  assert.ok(
    roleIssues.every((issue) => issue.suggestion.includes('button')),
    'Should suggest an action role'
  );
});

test('Analyzer - Detect click handlers without action roles', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div onclick="save()">Save</div>
        <span onclick="openMenu()">Menu</span>
        <div tabindex="0" onclick="submit()">Submit</div>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const roleIssues = results.issues.filter((i) => i.rule === 'missing-role-action');

  assert.equal(roleIssues.length, 3, 'Should find clickable non-semantic elements');
  assert.ok(
    roleIssues.some((issue) =>
      issue.message.includes('click handler but does not have an action role')
    ),
    'Should identify click handler issues'
  );
});

test('Analyzer - Ignores focusable elements with action roles or native actions', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <div tabindex="0" role="button">Save</div>
        <span tabindex="0" role="link">Read more</span>
        <div onclick="save()" role="button">Save</div>
        <button tabindex="0">Native button</button>
        <button onclick="save()">Native click button</button>
        <a href="/more" tabindex="0">Native link</a>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const roleIssues = results.issues.filter((i) => i.rule === 'missing-role-action');

  assert.equal(roleIssues.length, 0, 'Should ignore elements with action semantics');
});

test('Analyzer - Detect native label duplicate and conflict', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <button aria-label="Submit">Submit</button>
        <a href="/submit" aria-label="This is a button">Submit</a>
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const labelIssues = results.issues.filter((i) => i.rule === 'native-label');

  assert.equal(labelIssues.length, 2, 'Should find duplicate and conflicting aria-labels');
  assert.ok(
    labelIssues.some(
      (issue) =>
        issue.severity === 'warning' &&
        issue.message === 'Unnecessary aria-label duplicates native label text'
    ),
    'Should warn when aria-label duplicates native text'
  );
  assert.ok(
    labelIssues.some(
      (issue) =>
        issue.severity === 'error' &&
        issue.message === 'aria-label does not match native label text'
    ),
    'Should error when aria-label conflicts with native text'
  );
});

test('Analyzer - Detect native label conflicts on form controls', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <label for="email">Email</label>
        <input id="email" type="text" aria-label="Email" />
        <label>
          Subscribe
          <input type="checkbox" aria-label="Newsletter signup" />
        </label>
        <input type="submit" value="Search" aria-label="Search form" />
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const labelIssues = results.issues.filter((i) => i.rule === 'native-label');

  assert.equal(labelIssues.length, 3, 'Should compare aria-label to native form labels');
  assert.equal(labelIssues.filter((issue) => issue.severity === 'warning').length, 1);
  assert.equal(labelIssues.filter((issue) => issue.severity === 'error').length, 2);
});

test('Analyzer - Allows aria-label when no native label exists', async () => {
  const analyzer = new Analyzer();
  const html = `
    <html>
      <body>
        <button aria-label="Close"></button>
        <input type="text" aria-label="Search" />
      </body>
    </html>
  `;

  const results = await analyzer.analyzeHTML(html);
  const labelIssues = results.issues.filter((i) => i.rule === 'native-label');

  assert.equal(labelIssues.length, 0, 'Should allow aria-label when there is no native label');
});

test('Analyzer - Format results', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><img src="test.png" /></body></html>';

  const results = await analyzer.analyzeHTML(html);
  const formatted = analyzer.formatResults(results);

  assert.ok(formatted.includes('Semantica11y'), 'Should format as report');
  assert.ok(formatted.includes('Total Findings'), 'Should show findings summary');
  assert.ok(formatted.includes('Findings By Category'), 'Should show grouped findings section');
  assert.ok(formatted.includes('Errors ('), 'Should show errors section');
  assert.ok(formatted.includes('Warnings ('), 'Should show warnings section');
  assert.ok(formatted.includes('Suggestions ('), 'Should show suggestions section');
});

test('Reporter - Export console report to text file', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><button aria-label="Submit">Submit</button></body></html>';
  const results = await analyzer.analyzeHTML(html);
  const directory = await mkdtemp(path.join(os.tmpdir(), 'semantica11y-report-'));
  const reportPath = path.join(directory, 'report.txt');

  const writtenPath = await exportTextReport(results, reportPath);
  const report = await readFile(writtenPath, 'utf8');

  assert.equal(writtenPath, reportPath);
  assert.ok(report.includes('Semantica11y Analysis Report'));
  assert.ok(report.includes('Errors ('));
  assert.ok(report.includes('Warnings ('));
  assert.ok(!/\x1b\[[0-9;]*m/.test(report), 'Text export should not include ANSI colors');
});

test('Reporter - Format console report with colors', async () => {
  const analyzer = new Analyzer();
  const html = '<html><body><button aria-label="Submit">Submit</button></body></html>';
  const results = await analyzer.analyzeHTML(html);
  const report = formatConsoleReport(results);

  assert.ok(/\x1b\[[0-9;]*m/.test(report), 'Console report should include ANSI colors');
});

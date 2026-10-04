import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Analyzer, RuleEngine, configure, resetConfig } from '../src/index.js';

const html = '<img aria-label="Logo"><button aria-expanded="true">Menu</button>';

test('experimental rules require opt-in, including when explicitly selected', async () => {
  for (const options of [{}, { enabledRules: ['aria-expanded'] }]) {
    const analyzer = new Analyzer(options);
    assert.ok(!analyzer.ruleEngine.getActiveRules().some((r) => r.id === 'aria-expanded'));
    assert.ok(!(await analyzer.analyzeHTML(html)).issues.some((i) => i.rule === 'aria-expanded'));
  }
  const analyzer = new Analyzer({ experimental: true, enabledRules: ['aria-expanded'] });
  const results = await analyzer.analyzeHTML(html);
  assert.equal(results.issues.length, 1);
  assert.equal(results.issues[0].rule, 'aria-expanded');
});

test('severity filtering preserves errors from mixed-severity rules and summary counts', async () => {
  const analyzer = new Analyzer({ severities: ['error'], experimental: true });
  const results = await analyzer.analyzeHTML(html);
  assert.equal(results.issues.length, 1);
  assert.equal(results.issues[0].rule, 'image-alt');
  assert.deepEqual(results.summary, { total: 1, errors: 1, warnings: 0, suggestions: 0 });
  assert.ok(!analyzer.formatResults(results).includes('aria-expanded'));
});

test('includeWarnings false retains suggestions; empty filters return no findings', async () => {
  const results = await new Analyzer({ includeWarnings: false }).analyzeHTML(html);
  assert.equal(results.summary.warnings, 0);
  assert.ok(results.summary.suggestions > 0);
  for (const options of [{ enabledRules: [] }, { severities: [] }]) {
    assert.equal((await new Analyzer(options).analyzeHTML(html)).summary.total, 0);
  }
});

test('global configuration is snapshotted, overridable, resettable, and copied', async () => {
  try {
    const before = new Analyzer();
    const severities = ['error'];
    const config = configure({ severities, enabledRules: ['image-alt'], experimental: true });
    severities.push('warning');
    config.enabledRules.push('aria-expanded');
    const shared = new Analyzer();
    const override = new Analyzer({ severities: ['warning'] });
    resetConfig();
    assert.equal((await shared.analyzeHTML(html)).issues.length, 1);
    assert.deepEqual((await override.analyzeHTML(html)).issues.map((i) => i.severity), ['warning']);
    assert.ok((await before.analyzeHTML(html)).summary.warnings > 0);
    assert.equal(new Analyzer().options.experimental, false);
    assert.equal(shared.options.experimental, true);
  } finally {
    resetConfig();
  }
});

test('direct engines and custom rules honor configuration and skip excluded checks', async () => {
  let calls = 0;
  const custom = { id: 'custom', enabled: true, experimental: true,
    check() { calls++; return [{ rule: 'custom', severity: 'suggestion' }]; } };
  const document = new JSDOM(html).window.document;
  for (const options of [
    { enabledRules: ['custom'] },
    { enabledRules: [], experimental: true },
    { enabledRules: ['custom'], experimental: true },
  ]) {
    const engine = new RuleEngine([custom], options);
    const results = { issues: [], summary: { total: 0, errors: 0, warnings: 0, suggestions: 0 } };
    await engine.analyze(document, results);
    assert.equal(results.summary.total, engine.getActiveRules().length);
  }
  assert.equal(calls, 1);
});

test('invalid configuration fails early', () => {
  for (const options of [{ severities: ['errors'] }, { severities: 'error' },
    { enabledRules: 'image-alt' }, { experimental: 'true' }, { includeWarnings: null }]) {
    assert.throws(() => new Analyzer(options), TypeError);
  }
});

for (const attribute of ['aria-hidden="true"', 'role="presentation"',
  'aria-hidden="TRUE"', 'role="PRESENTATION"', 'aria-hidden="true" role="presentation"']) {
  test(`image-alt checks decorative markup: ${attribute}`, async () => {
    for (const [alt, errors, warnings] of [['', 1, 1], ['alt="Logo"', 0, 1], ['alt=""', 0, 0], ['alt', 0, 0]]) {
      const results = await new Analyzer({ enabledRules: ['image-alt'] })
        .analyzeHTML(`<img ${attribute} ${alt}>`);
      assert.equal(results.summary.errors, errors);
      assert.equal(results.summary.warnings, warnings);
    }
  });
}

test('image-alt ignores unrelated attribute values and preserves label checks', async () => {
  const analyzer = new Analyzer({ enabledRules: ['image-alt'] });
  assert.equal((await analyzer.analyzeHTML('<img alt="Logo" aria-hidden="false" role="img">')).summary.total, 0);
  const results = await analyzer.analyzeHTML('<img alt="" aria-hidden="true" aria-label="Logo">');
  assert.equal(results.summary.warnings, 1);
  assert.equal(results.issues[0].message, 'Image uses aria-label while alt is empty');
});

/**
 * Basic Playwright example demonstrating how to analyze rendered page HTML.
 *
 * Run with:
 *   node examples/basic.js
 */

import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { Analyzer, exportTextReport } from '../src/index.js';

const url = process.argv[2] || 'https://www.fandango.com/';
const reportPath = new URL('./semantica11y-report.txt', import.meta.url);

async function runExample() {
  console.log(`Semantica11y Playwright example\nAnalyzing: ${url}\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html = await page.content();
    const analyzer = new Analyzer();
    const results = await analyzer.analyzeHTML(html, url);

    console.log(analyzer.formatResults(results));

    await exportTextReport(results, reportPath);
    console.log(`Text report written to ${reportPath.pathname}`);

    assert.equal(results.summary.errors, 0, 'Expected no Semantica11y errors');
    assert.equal(results.summary.warnings, 0, 'Expected no Semantica11y warnings');
  } finally {
    await browser.close();
  }
}

runExample().catch((error) => {
  console.error('Example failed:', error.message);

  if (error.message.includes('Executable does not exist')) {
    console.error('\nInstall the Playwright browser once with: npm exec playwright install chromium');
  }

  process.exitCode = 1;
});

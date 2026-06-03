/**
 * HTML Analyzer - Core analysis engine for semantic and ARIA compliance
 */

import { JSDOM } from 'jsdom';
import { RuleEngine } from './engine/index.js';
import { createSemanticOverview, formatSemanticOverview } from './engine/overview/index.js';

export class Analyzer {
  /**
   * Creates a new Analyzer instance
   * @param {Object} options - Configuration options
   * @param {Array} options.rules - Custom rules to apply (uses defaults if not provided)
   * @param {boolean} options.includeWarnings - Include warning-level issues (default: true)
   */
  constructor(options = {}) {
    this.options = {
      includeWarnings: true,
      ...options,
    };
    this.ruleEngine = new RuleEngine(options.rules);
    this.results = null;
  }

  /**
   * Analyze HTML content for semantic and ARIA issues
   * @param {string} html - HTML content to analyze
   * @param {string} url - Optional URL for context
   * @returns {Promise<Object>} Analysis results with issues and suggestions
   */
  async analyzeHTML(html, url = '') {
    try {
      const dom = new JSDOM(html, url ? { url } : undefined);
      const document = dom.window.document;

      this.results = {
        url,
        timestamp: new Date().toISOString(),
        summary: {
          total: 0,
          errors: 0,
          warnings: 0,
          suggestions: 0,
        },
        issues: [],
        overview: null,
      };

      this.results.overview = createSemanticOverview(document);

      // Analyze the document with all rules
      await this.ruleEngine.analyze(document, this.results);

      return this.results;
    } catch (error) {
      throw new Error(`Failed to analyze HTML: ${error.message}`);
    }
  }

  /**
   * Analyze HTML from a file
   * @param {string} filePath - Path to HTML file
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeFile(filePath) {
    const fs = await import('fs').then((m) => m.promises);
    const html = await fs.readFile(filePath, 'utf-8');
    return this.analyzeHTML(html, `file://${filePath}`);
  }

  /**
   * Get results from the last analysis
   * @returns {Object|null} Last analysis results or null if no analysis performed
   */
  getResults() {
    return this.results;
  }

  /**
   * Format results for display
   * @param {Object} results - Analysis results
   * @returns {string} Formatted output
   */
  formatResults(results = this.results) {
    if (!results) return '';

    let output = `\n📊 Semantica11y Analysis Report\n`;
    output += `URL: ${results.url}\n`;
    output += `Time: ${results.timestamp}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    output += `Total Issues: ${results.summary.total}\n`;
    output += `  • Errors: ${results.summary.errors}\n`;
    output += `  • Warnings: ${results.summary.warnings}\n`;
    output += `  • Suggestions: ${results.summary.suggestions}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (results.overview) {
      output += `\n${formatSemanticOverview(results.overview)}\n`;
      output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    }

    if (results.issues.length > 0) {
      output += `\n🔍 Issues Found:\n`;
      results.issues.forEach((issue, index) => {
        output += `\n${index + 1}. [${issue.severity.toUpperCase()}] ${issue.rule}\n`;
        output += `   Element: ${issue.element}\n`;
        output += `   Message: ${issue.message}\n`;
        if (issue.suggestion) {
          output += `   💡 Suggestion: ${issue.suggestion}\n`;
        }
      });
    } else {
      output += `\n✅ No issues found!\n`;
    }

    return output;
  }
}

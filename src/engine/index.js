/**
 * Rule Engine - Core logic for semantic and ARIA analysis rules
 */

import { DEFAULT_RULES } from './definitions.js';
import { resolveConfig } from '../config.js';

export class RuleEngine {
  /**
   * Creates a new RuleEngine instance
   * @param {Array} customRules - Optional custom rules to append to defaults
   * @param {Object} options - Shared configuration overrides
   */
  constructor(customRules = [], options = {}) {
    this.options = resolveConfig(options);
    this.rules = [...DEFAULT_RULES, ...customRules];
  }

  /**
   * Add a custom rule
   * @param {Object} rule - Rule definition
   */
  addRule(rule) {
    this.rules.push(rule);
  }

  /**
   * Analyze a document against all rules
   * @param {Document} document - DOM document to analyze
   * @param {Object} results - Results object to populate
   */
  async analyze(document, results) {
    for (const rule of this.getActiveRules()) {

      try {
        const issues = rule.check(document);
        this.addIssuesToResults(results, issues);
      } catch (error) {
        console.error(`Error running rule "${rule.id}":`, error);
      }
    }

    // Update summary
    results.summary.total = results.issues.length;
  }

  /**
   * Add issues from a rule to results
   * @param {Object} results - Results object
   * @param {Array} issues - Issues array from rule
   */
  addIssuesToResults(results, issues) {
    issues.forEach((issue) => {
      if (!this.options.severities.includes(issue.severity)) return;
      if (!this.options.includeWarnings && issue.severity === 'warning') return;
      results.issues.push(issue);

      // Update summary counts
      if (issue.severity === 'error') {
        results.summary.errors++;
      } else if (issue.severity === 'warning') {
        results.summary.warnings++;
      } else if (issue.severity === 'suggestion') {
        results.summary.suggestions++;
      }
    });
  }

  /**
   * Get all active rules
   * @returns {Array} Active rules
   */
  getActiveRules() {
    return this.rules.filter((rule) =>
      rule.enabled &&
      (!rule.experimental || this.options.experimental) &&
      (this.options.enabledRules === null || this.options.enabledRules.includes(rule.id))
    );
  }

  /**
   * Get rule by ID
   * @param {string} id - Rule ID
   * @returns {Object|undefined} Rule definition or undefined
   */
  getRule(id) {
    return this.rules.find((r) => r.id === id);
  }
}

export { DEFAULT_RULES };

import { writeFile } from 'fs/promises';
import { formatSemanticOverview } from '../overview/index.js';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const ISSUE_SECTIONS = [
  {
    severity: 'error',
    title: 'Errors',
    color: COLORS.red,
  },
  {
    severity: 'warning',
    title: 'Warnings',
    color: COLORS.yellow,
  },
  {
    severity: 'suggestion',
    title: 'Suggestions',
    color: COLORS.cyan,
  },
];

function colorize(text, color, useColors) {
  return useColors ? `${color}${text}${COLORS.reset}` : text;
}

function formatIssue(issue, index) {
  let output = `\n${index + 1}. ${issue.rule}\n`;
  output += `   Element: ${issue.element}\n`;
  output += `   Message: ${issue.message}\n`;

  if (issue.suggestion) {
    output += `   Suggestion: ${issue.suggestion}\n`;
  }

  return output;
}

export function formatConsoleReport(results, options = {}) {
  if (!results) return '';

  const { colors = true } = options;
  let output = `\nSemantica11y Analysis Report\n`;
  output += `URL: ${results.url}\n`;
  output += `Time: ${results.timestamp}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `Total Findings: ${results.summary.total}\n`;
  output += `  Errors: ${results.summary.errors}\n`;
  output += `  Warnings: ${results.summary.warnings}\n`;
  output += `  Suggestions: ${results.summary.suggestions}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  if (results.overview) {
    output += `\n${formatSemanticOverview(results.overview)}\n`;
    output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  }

  if (results.issues.length > 0) {
    output += `\n${colorize('Findings By Category', COLORS.bold, colors)}\n`;

    ISSUE_SECTIONS.forEach(({ severity, title, color }) => {
      const issues = results.issues.filter((issue) => issue.severity === severity);

      output += `\n${colorize(`${title} (${issues.length})`, color, colors)}\n`;
      output += `${'─'.repeat(28)}\n`;

      if (issues.length === 0) {
        output += `No ${title.toLowerCase()} found.\n`;
        return;
      }

      issues.forEach((issue, index) => {
        output += formatIssue(issue, index);
      });
    });
  } else {
    output += `\nNo issues found!\n`;
  }

  return output;
}

export function printConsoleReport(results, options = {}) {
  const report = formatConsoleReport(results, options);
  console.log(report);
  return report;
}

export async function exportTextReport(results, filePath, options = {}) {
  const { colors = false } = options;
  const report = formatConsoleReport(results, { colors });

  await writeFile(filePath, report, 'utf8');

  return filePath;
}

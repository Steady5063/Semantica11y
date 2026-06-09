import { writeFile } from 'fs/promises';

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

function groupIssues(issues) {
  const groups = new Map();

  issues.forEach((issue) => {
    const key = JSON.stringify({
      rule: issue.rule,
      message: issue.message,
      suggestion: issue.suggestion || '',
    });

    if (!groups.has(key)) {
      groups.set(key, {
        rule: issue.rule,
        message: issue.message,
        suggestion: issue.suggestion,
        elements: [],
      });
    }

    groups.get(key).elements.push(issue.element);
  });

  return Array.from(groups.values());
}

function formatIssueGroup(group, index) {
  const instanceLabel = group.elements.length === 1 ? 'instance' : 'instances';
  let output = `\n${index + 1}. Rule: ${group.rule} (${group.elements.length} ${instanceLabel})\n`;
  output += `   Message: ${group.message}\n`;

  if (group.suggestion) {
    output += `   Suggestion: ${group.suggestion}\n`;
  }

  output += '   Elements:\n';
  group.elements.forEach((element) => {
    output += `     - ${element}\n`;
  });

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

      groupIssues(issues).forEach((group, index) => {
        output += formatIssueGroup(group, index);
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

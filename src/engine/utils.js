/**
 * Helper function to get approximate line number of an element
 * (JSDOM doesn't provide line numbers, so this is a placeholder)
 */
export function getLineNumber(element) {
  // In a real implementation, you might track this during DOM traversal
  return 0;
}

export function getElementSignature(element) {
  const attributes = ['id', 'class', 'role']
    .map((attribute) => {
      const value = element.getAttribute(attribute);
      return value ? ` ${attribute}="${value}"` : '';
    })
    .join('');

  return `<${element.tagName.toLowerCase()}${attributes}>`;
}

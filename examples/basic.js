/**
 * Basic example demonstrating how to use Semantica11y
 */

import { Analyzer } from '../src/index.js';

// Sample HTML with various accessibility issues
const sampleHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
</head>
<body>
    <div id="header">
        <div class="navbar">
            <a href="/">Home</a>
            <a href="/about">About</a>
        </div>
    </div>

    <div id="main-content">
        <h1>Welcome</h1>
        <h3>Why This Product</h3>
        
        <img src="logo.png" />
        
        <form>
            <input type="text" id="username" name="username" />
            <input type="password" id="password" name="password" />
            <button>Login</button>
        </form>
    </div>

    <div id="footer">
        <p>&copy; 2024 My Company</p>
    </div>
</body>
</html>
`;

async function runExample() {
  console.log('🚀 Semantica11y Example Analysis\n');

  const analyzer = new Analyzer();

  try {
    const results = await analyzer.analyzeHTML(sampleHTML, 'https://example.com');
    console.log(analyzer.formatResults(results));
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

runExample();

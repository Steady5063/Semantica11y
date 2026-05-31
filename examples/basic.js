/**
 * Basic example demonstrating how to use Semantica11y
 */

import { Analyzer } from '../src/index.js';

// Sample HTML with various accessibility issues
const sampleHTML = `
<div class="listing">  
   <div class="imageContainer" tabindex="0">
    <img alt="" class="stockImage" src={this.props.imageSrc}/>
   </div>
   <div class="details">
   <span role="heading" aria-level="4">{this.props.pd}</span>
      <section class="list" role="list">
        <span class="dot"></span>
        <div class="li" role="listitem">
          {this.props.descOne} </div>
        <span class="dot"></span>
        <div class="li" role="listitem"> 
          {this.props.descTwo}</div>
        <span class="dot"></span>
        <div class="li" role="listitem">
          {this.props.descThree}</div>
      </section>
      <div role="button" tabindex="0" class="btn" 
           onClick={this.addCart}></div>
    </div>
</div>
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

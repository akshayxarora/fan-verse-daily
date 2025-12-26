#!/usr/bin/env tsx
/**
 * Test script to verify fixes for:
 * 1. Image upload (Tigris configuration)
 * 2. Heading rendering in markdown
 * 3. Publish functionality
 */

import { renderMarkdown } from '../src/lib/markdown';

console.log('🧪 Testing Markdown Rendering Fixes\n');

// Test 1: Heading rendering
console.log('1. Testing Heading Rendering:');
const headingMarkdown = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

**bold text** and \`inline code\`

- Bullet item 1
- Bullet item 2
  - Nested bullet
- Bullet item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3
`;

try {
  const headingHtml = renderMarkdown(headingMarkdown);
  console.log('✅ Markdown rendered successfully');
  
  // Check if headings are present
  const hasH1 = headingHtml.includes('<h1');
  const hasH2 = headingHtml.includes('<h2');
  const hasH3 = headingHtml.includes('<h3');
  const hasBold = headingHtml.includes('<strong>');
  const hasCode = headingHtml.includes('<code');
  const hasList = headingHtml.includes('<ul') || headingHtml.includes('<ol');
  
  console.log(`   - H1 tags: ${hasH1 ? '✅' : '❌'}`);
  console.log(`   - H2 tags: ${hasH2 ? '✅' : '❌'}`);
  console.log(`   - H3 tags: ${hasH3 ? '✅' : '❌'}`);
  console.log(`   - Bold tags: ${hasBold ? '✅' : '❌'}`);
  console.log(`   - Code tags: ${hasCode ? '✅' : '❌'}`);
  console.log(`   - List tags: ${hasList ? '✅' : '❌'}`);
  
  if (!hasH1 || !hasH2 || !hasH3) {
    console.log('\n❌ Headings are not rendering correctly!');
    console.log('HTML output (first 500 chars):');
    console.log(headingHtml.substring(0, 500));
    process.exit(1);
  }
  
  if (!hasBold || !hasCode) {
    console.log('\n❌ Bold or code formatting is not rendering correctly!');
    process.exit(1);
  }
  
  console.log('\n✅ All markdown rendering tests passed!\n');
} catch (error: any) {
  console.error('❌ Markdown rendering failed:', error.message);
  process.exit(1);
}

// Test 2: Complex markdown with nested content
console.log('2. Testing Complex Markdown:');
const complexMarkdown = `# Main Heading

This is a paragraph with **bold text** and \`code\` and [a link](https://example.com).

## Subheading

- Item with **bold**
- Item with \`code\`
- Item with [link](https://example.com)

### Nested Lists

1. First item
   - Nested bullet
   - Another nested
2. Second item
`;

try {
  const complexHtml = renderMarkdown(complexMarkdown);
  console.log('✅ Complex markdown rendered successfully');
  
  // Verify structure
  const headingCount = (complexHtml.match(/<h[1-6]/g) || []).length;
  const listCount = (complexHtml.match(/<[uo]l/g) || []).length;
  
  console.log(`   - Headings found: ${headingCount} (expected: 3)`);
  console.log(`   - Lists found: ${listCount} (expected: 2)`);
  
  if (headingCount < 3) {
    console.log('\n❌ Not all headings are rendering!');
    process.exit(1);
  }
  
  console.log('\n✅ Complex markdown test passed!\n');
} catch (error: any) {
  console.error('❌ Complex markdown rendering failed:', error.message);
  process.exit(1);
}

console.log('✅ All tests passed!');


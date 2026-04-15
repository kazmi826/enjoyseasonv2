const fs = require('fs');

try {
  let d = fs.readFileSync('data/actors.json', 'utf8');
  console.log('File size:', d.length);
  console.log('Last 100 chars:', JSON.stringify(d.slice(-100)));
  
  // Try parsing as is
  try {
    const parsed = JSON.parse(d);
    console.log('File is OK! Actors:', parsed.length);
  } catch(e) {
    console.log('Parse error:', e.message);
    
    // Fix: find last } and close array
    const lastBracket = d.lastIndexOf('}');
    console.log('Last } at position:', lastBracket);
    
    const fixed = d.substring(0, lastBracket + 1) + '\n]';
    fs.writeFileSync('data/actors.json', fixed);
    console.log('Fixed file written!');
    
    // Verify fix
    const parsed2 = JSON.parse(fixed);
    console.log('Total actors after fix:', parsed2.length);
  }
} catch(e) {
  console.log('Error:', e.message);
}
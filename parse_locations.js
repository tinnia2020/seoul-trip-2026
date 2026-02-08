// Parse the Google Maps list data from Tina's file
const fs = require('fs');

// Read the raw file
let raw = fs.readFileSync('google_maps_data.txt', 'utf-8');

// Remove RTF formatting - extract the JSON part
const jsonMatch = raw.match(/\[\[\[.*\]\]\]/s);
if (!jsonMatch) {
  console.log('Could not find JSON data');
  process.exit(1);
}

// The data is encoded with \uXXXX patterns, need to decode
let jsonStr = jsonMatch[0];

// Decode unicode escapes like \u20154
jsonStr = jsonStr.replace(/\\u(\d+)/g, (match, code) => {
  return String.fromCharCode(parseInt(code));
});

// Also handle the RTF line continuation
jsonStr = jsonStr.replace(/\\\n/g, '');
jsonStr = jsonStr.replace(/\\'/g, "'");

try {
  const data = JSON.parse(jsonStr);
  
  // The locations are in data[0][7] array
  const locations = data[0][7] || [];
  
  const parsed = [];
  
  for (const loc of locations) {
    if (!loc || !Array.isArray(loc)) continue;
    
    // Structure: [null, [null, null, address, null, "", [null, null, lat, lon], ...], name, note, ...]
    const inner = loc[1];
    if (!inner) continue;
    
    const coords = inner[5];
    const lat = coords ? coords[2] : null;
    const lon = coords ? coords[3] : null;
    
    const name = loc[2] || '';
    const note = loc[3] || '';
    
    if (name && lat && lon) {
      parsed.push({
        name: name.trim(),
        note: note.trim(),
        lat,
        lon
      });
    }
  }
  
  console.log(JSON.stringify(parsed, null, 2));
  console.log(`\nTotal: ${parsed.length} locations`);
  
} catch (e) {
  console.log('Parse error:', e.message);
  // Try to find location patterns directly
  const locPattern = /\[null,null,(\d+\.\d+),(\d+\.\d+)\]/g;
  let match;
  while ((match = locPattern.exec(raw)) !== null) {
    console.log(`Found coords: ${match[1]}, ${match[2]}`);
  }
}

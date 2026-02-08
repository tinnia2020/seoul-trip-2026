const fs = require('fs');

// Read raw file
let raw = fs.readFileSync('google_maps_data.txt', 'utf-8');

// Decode RTF unicode - \uXXXX format
raw = raw.replace(/\\u(\d+)\s?/g, (match, code) => String.fromCharCode(parseInt(code)));
raw = raw.replace(/\\\n/g, ' ');
raw = raw.replace(/\\'/g, "'");

// Find all location blocks - pattern: [null,[null,null,addr,null,"",[null,null,LAT,LON]...],"NAME","NOTE",...]
const locationPattern = /\[null,\[null,null,"[^"]*",null,"",\[null,null,([\d.]+),([\d.]+)\],\["[^"]*","[^"]*"\]\],"([^"]*)","([^"]*)"/g;

const locations = [];
let match;

while ((match = locationPattern.exec(raw)) !== null) {
  locations.push({
    lat: parseFloat(match[1]),
    lon: parseFloat(match[2]),
    name: match[3],
    note: match[4]
  });
}

console.log(`Found ${locations.length} locations with full info\n`);

// If that didn't work, try simpler pattern
if (locations.length === 0) {
  // Try to extract name-coordinate pairs another way
  // Look for patterns like: ],"NAME","NOTE", followed by coordinates
  const simplePattern = /\],?"([^"]{2,50})","([^"]*)"[^[]*\[null,null,([\d.]+),([\d.]+)\]/g;
  
  while ((match = simplePattern.exec(raw)) !== null) {
    locations.push({
      name: match[1],
      note: match[2],
      lat: parseFloat(match[3]),
      lon: parseFloat(match[4])
    });
  }
  console.log(`Simple pattern found ${locations.length} locations\n`);
}

// Let's also try extracting by looking at the structure more carefully
// Each location entry starts after coordinates and has the name and note
const blocks = raw.split(/\],\[null,\[null,null,/);
console.log(`Found ${blocks.length} potential blocks\n`);

// Extract data differently - find coords then look backwards for name
const coordsPattern = /\[null,null,(37\.\d+),(12[67]\.\d+)\]/g;
const coordsList = [];
while ((match = coordsPattern.exec(raw)) !== null) {
  coordsList.push({
    lat: parseFloat(match[1]),
    lon: parseFloat(match[2]),
    index: match.index
  });
}

// For each coordinate, look for the name that comes after
const results = [];
for (let i = 0; i < coordsList.length; i++) {
  const coord = coordsList[i];
  // Look for the name pattern after this coordinate: ],"NAME","NOTE"
  const afterCoord = raw.substring(coord.index, coord.index + 500);
  const nameMatch = afterCoord.match(/\]\],"([^"]+)","([^"]*)"/);
  if (nameMatch) {
    results.push({
      name: nameMatch[1],
      note: nameMatch[2].substring(0, 100),
      lat: coord.lat,
      lon: coord.lon
    });
  }
}

console.log(`Extracted ${results.length} locations with names\n`);

// Print first 10
results.slice(0, 20).forEach((loc, i) => {
  console.log(`${i+1}. ${loc.name}`);
  if (loc.note) console.log(`   Note: ${loc.note.substring(0, 50)}...`);
  console.log(`   Coords: ${loc.lat}, ${loc.lon}\n`);
});

// Save to JSON
fs.writeFileSync('extracted_locations.json', JSON.stringify(results, null, 2));
console.log(`\nSaved ${results.length} locations to extracted_locations.json`);

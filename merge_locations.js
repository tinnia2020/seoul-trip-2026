const fs = require('fs');

// Read existing HTML to extract current places
const html = fs.readFileSync('Seoul_Trip_Complete.html', 'utf-8');
const placesMatch = html.match(/const places = \[([\s\S]*?)\];/);

// Load new locations
const newLocs = JSON.parse(fs.readFileSync('processed_locations.json', 'utf-8'));

// Category mapping
const catMap = {
  'food': '美食',
  'cafe': '咖啡甜點',
  'shop': '購物',
  'sight': '景點',
  'hotel': '住宿'
};

// Zone detection based on coordinates
function getZone(lat, lon) {
  // Seongsu area: around 37.54, 127.05
  if (lat >= 37.535 && lat <= 37.55 && lon >= 127.04 && lon <= 127.07) return '聖水洞';
  // Hongdae/Yeonnam: around 37.55-37.57, 126.91-126.93
  if (lat >= 37.54 && lat <= 37.57 && lon >= 126.91 && lon <= 126.94) return '弘大/延南';
  // Myeongdong/Jongno: around 37.56-37.58, 126.97-127.01
  if (lat >= 37.56 && lat <= 37.59 && lon >= 126.96 && lon <= 127.01) return '明洞/鍾路';
  // Samcheong/Bukchon: around 37.57-37.59, 126.97-126.99
  if (lat >= 37.57 && lat <= 37.59 && lon >= 126.96 && lon <= 126.99) return '三清洞';
  // Seochon: around 37.57-37.58, 126.96-126.98
  if (lat >= 37.575 && lat <= 37.585 && lon >= 126.965 && lon <= 126.985) return '西村';
  // Hannam/Itaewon: around 37.53, 127.0
  if (lat >= 37.52 && lat <= 37.54 && lon >= 126.99 && lon <= 127.02) return '漢南/梨泰院';
  // Gangnam: around 37.50-37.52, 127.0-127.07
  if (lat >= 37.49 && lat <= 37.52 && lon >= 127.00 && lon <= 127.08) return '江南';
  // Jamsil/Lotte: around 37.51, 127.1
  if (lon >= 127.08) return '蠶室/樂天';
  // Eunpyeong: north around 37.62-37.65
  if (lat >= 37.61) return '恩平區';
  // Default
  return '首爾市區';
}

// Convert new locations to the HTML format
const newPlaces = newLocs.map(loc => {
  const category = catMap[loc.category] || '景點';
  const zone = getZone(loc.lat, loc.lon);
  
  return {
    cn_name: loc.name,
    kr_name: loc.korean,
    category: category,
    note: loc.note.substring(0, 60),
    hours: '',
    zone: zone,
    lat: loc.lat,
    lon: loc.lon,
    mustTry: loc.note.length > 60 ? loc.note : '',
    price: ''
  };
});

// Filter out locations that already exist (by name similarity)
const existingNames = [];
const existingMatch = html.match(/"cn_name":"([^"]+)"/g);
if (existingMatch) {
  existingMatch.forEach(m => {
    const name = m.replace('"cn_name":"', '').replace('"', '');
    existingNames.push(name.toLowerCase());
  });
}

const filteredNew = newPlaces.filter(p => {
  const nameLower = p.cn_name.toLowerCase();
  // Check if this name or similar already exists
  return !existingNames.some(existing => 
    existing.includes(nameLower) || 
    nameLower.includes(existing) ||
    (p.kr_name && existing.includes(p.kr_name.toLowerCase()))
  );
});

console.log(`Existing locations: ${existingNames.length}`);
console.log(`New locations: ${newPlaces.length}`);
console.log(`Filtered (truly new): ${filteredNew.length}`);

// Generate JavaScript array string for the new places
let jsArray = '';
filteredNew.forEach((p, i) => {
  const comma = i < filteredNew.length - 1 ? ',' : '';
  jsArray += `            {"cn_name":"${p.cn_name.replace(/"/g, '\\"')}","kr_name":"${p.kr_name}","category":"${p.category}","note":"${p.note.replace(/"/g, '\\"')}","hours":"","zone":"${p.zone}","lat":${p.lat},"lon":${p.lon}${p.mustTry ? `,"mustTry":"${p.mustTry.replace(/"/g, '\\"')}"` : ''}}${comma}\n`;
});

console.log('\n// New places to add:');
console.log(jsArray);

// Save to file
fs.writeFileSync('new_places_to_add.js', jsArray);
console.log('\nSaved to new_places_to_add.js');

// Also output category summary
const catSummary = {};
filteredNew.forEach(p => catSummary[p.category] = (catSummary[p.category] || 0) + 1);
console.log('\nCategory breakdown:');
Object.entries(catSummary).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

const fs = require('fs');
const https = require('https');

const csvPath = 'Seoul_Trip_Locations_v2.csv';
const outPath = 'locations_with_coords.json';

function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    // Helper to handle commas inside quotes if any (simple split is risky but let's try regex)
    // Actually, looking at the CSV structure from `read`, it seems standard.
    // "청와옥 을지로3가직영점 (Cheongwaok),美食,劉在石推薦湯飯,08:00 - 22:00,서울 중구 을지로 110"
    // The address is the last column.
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple split by comma might fail if fields contain commas. 
        // But let's assume standard CSV structure or handle quotes.
        // A robust regex for CSV splitting:
        const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        // The regex above is imperfect. Let's use a simpler split if no quotes are used heavily.
        // The address is the last field. Let's grab it by index if possible.
        // Or better: split by comma, but rejoin the last parts if address has commas?
        // Korean addresses usually don't have commas.
        
        // Actually, let's just use `line.split(',')` and hope.
        // Wait, looking at the CSV again: "推薦 No.29, No.7, No.5" has commas inside quotes.
        // I need a proper CSV parser or a regex.
        
        // Regex to match CSV fields:
        const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        // This is getting complicated to write in one go.
        // Let's use a simple state machine parser or just split by comma and handle the quoted field.
        
        let fields = [];
        let current = '';
        let inQuote = false;
        
        for (let char of line) {
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current.trim());
        
        // fields: [Name, Category, Note, Hours, Address]
        // Address is last.
        if (fields.length >= 5) {
            data.push({
                name: fields[0],
                category: fields[1],
                note: fields[2],
                hours: fields[3],
                address: fields[fields.length - 1] // Last one is address
            });
        }
    }
    return data;
}

function fetchCoordinates(address) {
    return new Promise((resolve, reject) => {
        // Clean address for search: remove (brackets) if needed, but sometimes they help.
        // Nominatim works best with clean addresses.
        // Korean addresses in the CSV look like: "서울 중구 을지로 110"
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        
        const options = {
            headers: {
                'User-Agent': 'OpenClaw-Seoul-Trip-Geocoding/1.0 (tinni@openclaw.ai)' 
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.length > 0) {
                        resolve({ lat: json[0].lat, lon: json[0].lon });
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    console.error("Parse error for " + address);
                    resolve(null);
                }
            });
        }).on('error', (e) => {
            resolve(null);
        });
    });
}

async function run() {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const locations = parseCSV(csvContent);
    const results = [];
    
    console.log(`Found ${locations.length} locations. Starting geocoding...`);
    
    for (const loc of locations) {
        process.stdout.write(`Geocoding ${loc.name}... `);
        const coords = await fetchCoordinates(loc.address);
        
        if (coords) {
            console.log(`OK (${coords.lat}, ${coords.lon})`);
            loc.lat = coords.lat;
            loc.lon = coords.lon;
        } else {
            console.log(`FAILED. Trying simplified address...`);
            // Fallback: Try removing details? Or just "Seoul [Name]"?
            // Let's try searching by Name if Address fails?
            // Actually, let's try the name.
            const coords2 = await fetchCoordinates(loc.name.split('(')[0]);
             if (coords2) {
                console.log(`  -> Found by Name: OK`);
                loc.lat = coords2.lat;
                loc.lon = coords2.lon;
            } else {
                console.log(`  -> Still FAILED`);
                loc.lat = null;
                loc.lon = null;
            }
        }
        
        results.push(loc);
        
        // Sleep 1.2s
        await new Promise(r => setTimeout(r, 1200));
    }
    
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`Done. Saved to ${outPath}`);
}

run();

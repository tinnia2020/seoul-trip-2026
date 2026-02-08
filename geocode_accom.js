const https = require('https');

const places = [
    { name: "맹그로브 동대문 (Mangrove Dongdaemun)", query: "Mangrove Dongdaemun" },
    { name: "로컬스티치 서교 (Local Stitch Seogyo)", query: "Local Stitch Seogyo" },
    { name: "맹그로브 신설 (Mangrove Sinseol)", query: "Mangrove Sinseol" },
    { name: "호텔 카푸치노 (Hotel Cappuccino)", query: "Hotel Cappuccino Seoul" }
];

function fetchCoordinates(query) {
    return new Promise((resolve, reject) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const options = { headers: { 'User-Agent': 'OpenClaw-Agent/1.0' } };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.length) resolve(json[0]);
                    else resolve(null);
                } catch(e) { resolve(null); }
            });
        });
    });
}

async function run() {
    for (const p of places) {
        const res = await fetchCoordinates(p.query);
        if (res) {
            console.log(`${p.name}|${res.lat}|${res.lon}`);
        } else {
            console.log(`${p.name}|NOT_FOUND`);
        }
        await new Promise(r => setTimeout(r, 1500));
    }
}

run();

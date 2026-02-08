
const fs = require('fs');

const csv = fs.readFileSync('Seoul_Trip_Locations.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());
const headers = lines[0].split(',');

// Simple CSV parser that handles quotes
function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

let html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首爾之旅 - Naver Map 快速儲存清單</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: #f5f6f8; padding: 20px; max-width: 600px; margin: 0 auto; }
        .card { background: white; padding: 15px; margin-bottom: 15px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .name { font-weight: bold; font-size: 1.1em; color: #333; margin-bottom: 5px; }
        .meta { font-size: 0.9em; color: #666; margin-bottom: 10px; }
        .btn { 
            display: block; 
            background: #03C75A; /* Naver Green */
            color: white; 
            text-align: center; 
            padding: 10px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
        }
        .note { font-size: 0.8em; color: #999; margin-top: 5px; }
    </style>
</head>
<body>
    <h2 style="text-align:center;">🇰🇷 Naver Map 快速儲存列表</h2>
    <p style="text-align:center; color:#666; font-size:0.9em;">點擊綠色按鈕開啟 Naver Map，然後點擊星星 ⭐ 儲存。</p>
`;

// Skip header
for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length < 5) continue;

    const name = cols[0];
    const category = cols[1];
    const note = cols[2];
    const hours = cols[3];
    const address = cols[4];

    // Strategy: Search by Address first as it's more precise, if fail, try Name.
    // Actually, Naver Map search works best with specific names + location, or just the Korean address.
    // If address has Korean, perfect. If English, it works too.
    const query = encodeURIComponent(address || name);
    const link = `https://map.naver.com/p/search/${query}`;
    // Mobile URL scheme is supported but web link is safer to redirect
    
    html += `
    <div class="card">
        <div class="name">${name}</div>
        <div class="meta">
            ${category} · 🕒 ${hours || '未標示'}<br>
            📍 ${address}
        </div>
        <a href="${link}" target="_blank" class="btn">在 Naver Map 開啟</a>
        ${note ? `<div class="note">💡 ${note}</div>` : ''}
    </div>
    `;
}

html += `</body></html>`;

fs.writeFileSync('Naver_Map_Links.html', html);

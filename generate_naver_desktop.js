
const fs = require('fs');

const csv = fs.readFileSync('Seoul_Trip_Locations.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim());

// Simple CSV parser
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
    <title>首爾之旅 - Naver Map 電腦版快速儲存</title>
    <style>
        body { font-family: "Microsoft JhengHei", -apple-system, sans-serif; background: #f0f2f5; padding: 40px; }
        .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
            transition: transform 0.2s;
            border-left: 5px solid #03C75A;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .category { font-size: 0.85em; color: #03C75A; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .name { font-weight: bold; font-size: 1.2em; color: #333; margin-bottom: 10px; line-height: 1.4; }
        .info { font-size: 0.9em; color: #666; margin-bottom: 15px; }
        .btn { 
            display: block; 
            background: #03C75A; 
            color: white; 
            text-align: center; 
            padding: 12px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
            transition: background 0.2s;
        }
        .btn:hover { background: #02b350; }
        .btn:visited { background: #555; content: "已點擊"; }
        .note { 
            margin-top: 10px; 
            padding-top: 10px; 
            border-top: 1px solid #eee; 
            font-size: 0.85em; 
            color: #888; 
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🇰🇷 Naver Map 電腦版快速作業中心</h1>
        <p>請先在瀏覽器登入 Naver 帳號，然後依序點擊開啟並按下「儲存 (Save)」⭐</p>
    </div>
    <div class="container">
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
    
    // Prefer address for accuracy, fallback to name
    const query = encodeURIComponent(address || name);
    const link = `https://map.naver.com/p/search/${query}`;
    
    html += `
    <div class="card">
        <div class="category">${category}</div>
        <div class="name">${name}</div>
        <div class="info">🕒 ${hours || '未標示'}</div>
        <a href="${link}" target="_blank" class="btn">開啟地圖 ↗</a>
        ${note ? `<div class="note">💡 ${note}</div>` : ''}
    </div>
    `;
}

html += `</div></body></html>`;

fs.writeFileSync('Naver_Map_Desktop.html', html);

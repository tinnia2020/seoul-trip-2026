
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
    <title>首爾之旅 - Naver Map 快速儲存 (v2 強強版)</title>
    <style>
        body { font-family: "Microsoft JhengHei", -apple-system, sans-serif; background: #f0f2f5; padding: 40px; }
        .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
            transition: transform 0.2s;
            border-left: 5px solid #03C75A;
            display: flex;
            flex-direction: column;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .category { font-size: 0.85em; color: #03C75A; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .name { font-weight: bold; font-size: 1.2em; color: #333; margin-bottom: 5px; line-height: 1.4; }
        .addr { font-size: 0.85em; color: #888; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .info { font-size: 0.9em; color: #666; margin-bottom: 15px; flex-grow: 1; }
        .actions { display: flex; gap: 10px; margin-top: auto; }
        .btn { 
            flex: 1;
            display: block; 
            background: #03C75A; 
            color: white; 
            text-align: center; 
            padding: 10px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: bold;
            font-size: 0.9em;
            transition: background 0.2s;
        }
        .btn.secondary { background: #5c7cfa; } /* Blue for Name search */
        .btn:hover { opacity: 0.9; }
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
        <h1>🇰🇷 Naver Map 快速儲存 (v2 精準版)</h1>
        <p>提供兩種搜尋按鈕，確保一定找得到！</p>
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
    
    // Clean up address for search (remove postal codes sometimes helps, but Naver is okay with them)
    // Try to extract Korean part from name if available
    const koreanNameMatch = name.match(/[\u3131-\uD79D]+/);
    const searchName = koreanNameMatch ? koreanNameMatch[0] : name;

    const linkAddr = `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
    const linkName = `https://map.naver.com/p/search/${encodeURIComponent(searchName)}`;
    
    html += `
    <div class="card">
        <div class="category">${category}</div>
        <div class="name">${name}</div>
        <div class="addr">📍 ${address}</div>
        <div class="info">🕒 ${hours || '未標示'}</div>
        
        <div class="actions">
            <a href="${linkAddr}" target="_blank" class="btn">搜地址</a>
            <a href="${linkName}" target="_blank" class="btn secondary">搜店名</a>
        </div>

        ${note ? `<div class="note">💡 ${note}</div>` : ''}
    </div>
    `;
}

html += `</div></body></html>`;

fs.writeFileSync('Naver_Map_Desktop_v2.html', html);

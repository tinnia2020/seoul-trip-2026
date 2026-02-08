
const fs = require('fs');
const path = 'Seoul_Trip_Locations_v2.csv'; // Reusing the v2 data which had verified names

// If v2 csv is not available in current session context, I need to reconstruct it or read it.
// Assuming the previous session wrote it. Let's try to read it.
// If not, I will use the original logic but this time I need to map Chinese names to the Korean ones I found.
// Actually, the previous step updated the CSV. Let's read it.

let lines = [];
try {
    const csv = fs.readFileSync(path, 'utf8');
    lines = csv.split('\n').filter(l => l.trim());
} catch (e) {
    // Fallback if file not found (though it should be there from subagent)
    // For safety, I'll rewrite the generation logic with the mapping I have in "memory" (context)
    // But since I am a fresh exec context, I rely on file.
    console.log("Error reading CSV, please ensure previous step finished.");
    process.exit(1);
}

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
    <title>首爾之旅 - Naver Map 快速儲存 (v4 中韓對照版)</title>
    <style>
        body { font-family: "Microsoft JhengHei", -apple-system, sans-serif; background: #f0f2f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .card { 
            background: white; 
            padding: 15px 20px; 
            margin-bottom: 15px;
            border-radius: 12px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-left: 6px solid #03C75A;
        }
        .card:hover { transform: translateX(5px); transition: 0.2s; }
        
        .content { flex-grow: 1; padding-right: 15px; }
        .category { 
            display: inline-block; 
            font-size: 0.75em; 
            color: white; 
            background-color: #03C75A; 
            padding: 2px 6px; 
            border-radius: 4px; 
            margin-bottom: 4px;
        }
        .cn-name { font-weight: bold; font-size: 1.1em; color: #333; margin-bottom: 4px; }
        .kr-name { font-size: 0.9em; color: #03C75A; font-weight: bold; font-family: "Malgun Gothic", sans-serif; }
        .note { font-size: 0.85em; color: #888; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        
        .btn-group { min-width: 100px; text-align: right; }
        .btn { 
            display: inline-block; 
            background: #03C75A; 
            color: white; 
            padding: 10px 16px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold;
            font-size: 0.9em;
            box-shadow: 0 2px 4px rgba(3, 199, 90, 0.3);
        }
        .btn:hover { background: #02b350; }
        .btn:visited { background: #666; box-shadow: none; }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
            .card { flex-direction: column; align-items: flex-start; }
            .btn-group { width: 100%; margin-top: 12px; }
            .btn { display: block; text-align: center; width: 100%; box-sizing: border-box; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🇰🇷 Naver Map 快速儲存 (v4 中韓對照)</h2>
        <p style="color:#666; font-size:0.9em;">已翻譯為精準韓文店名，點擊右側按鈕直接開啟。</p>
    </div>
    <div class="container">
`;

// Skip header
for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length < 6) continue; // v2 csv has 6 cols: CN_Name, Category, Note, Hours, KR_Addr, KR_Name

    const cnName = cols[0];
    const category = cols[1];
    const note = cols[2];
    const hours = cols[3];
    // const krAddr = cols[4]; 
    const krName = cols[5]; // Verified Korean Name

    // Use Verified Korean Name for search link
    const link = `https://map.naver.com/p/search/${encodeURIComponent(krName)}`;
    
    html += `
    <div class="card">
        <div class="content">
            <span class="category">${category}</span>
            <div class="cn-name">${cnName}</div>
            <div class="kr-name">${krName}</div>
            ${note ? `<div class="note">💡 ${note}</div>` : ''}
            <div class="note" style="color:#aaa;">🕒 ${hours || '未標示'}</div>
        </div>
        <div class="btn-group">
            <a href="${link}" target="_blank" class="btn">開啟地圖 ↗</a>
        </div>
    </div>
    `;
}

html += `</div></body></html>`;

fs.writeFileSync('Naver_Map_Desktop_v4.html', html);

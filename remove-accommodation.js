const fs = require('fs');

let html = fs.readFileSync('seoul-trip-complete.html', 'utf8');

// 找到資料陣列
const match = html.match(/var D=\[([\s\S]*?)\];/);
if (!match) {
    console.log('找不到資料陣列');
    process.exit(1);
}

// 解析資料
const dataStr = match[1];
const data = eval('[' + dataStr + ']');

// 過濾掉住宿類別
const filtered = data.filter(p => p.cat !== '住宿');

console.log('原始景點數：', data.length);
console.log('移除住宿後：', filtered.length);
console.log('移除了', data.length - filtered.length, '個住宿地標');

// 重新生成資料字串
const newDataStr = filtered.map(p => {
    const parts = [`cn:"${p.cn}"`, `kr:"${p.kr}"`, `cat:"${p.cat}"`];
    if (p.note) parts.push(`note:"${p.note}"`);
    if (p.hours) parts.push(`hours:"${p.hours}"`);
    if (p.zone) parts.push(`zone:"${p.zone}"`);
    if (p.lat) parts.push(`lat:${p.lat}`);
    if (p.lon) parts.push(`lon:${p.lon}`);
    if (p.must) parts.push(`must:"${p.must}"`);
    if (p.price) parts.push(`price:"${p.price}"`);
    return `{${parts.join(',')}}`;
}).join(',');

// 替換
html = html.replace(/var D=\[[\s\S]*?\];/, `var D=[${newDataStr}];`);

// 保存
fs.writeFileSync('seoul-trip-complete.html', html);
console.log('✅ 已移除所有住宿地標');

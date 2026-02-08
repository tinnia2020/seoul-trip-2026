
const fs = require('fs');

// Hardcode data because file read might be unreliable across sessions or encoding issues
const data = [
    {cn:"青瓦屋 (을지로3가직영점)", cat:"美食", note:"劉在石推薦湯飯", hrs:"08:00 - 22:00", kr:"청와옥 을지로3가직영점"},
    {cn:"倫敦貝果博物館 (安國店)", cat:"早午餐", note:"推大蒜口味", hrs:"08:00 - 18:00", kr:"런던베이글뮤지엄 안국점"},
    {cn:"神仙雪濃湯 (明洞店)", cat:"美食", note:"建議加鹽巴", hrs:"24 小時營業", kr:"신선설농탕 명동점"},
    {cn:"無垢屋 (安國店)", cat:"美食", note:"12:00 開放訂位", hrs:"11:30 - 21:00", kr:"무구 안국점"},
    {cn:"朝朝刀削麵", cat:"美食", note:"", hrs:"10:00 - 21:30", kr:"조조칼국수 시청점"},
    {cn:"小豬存錢筒", cat:"美食", note:"弘大站 8 號出口", hrs:"14:00 - 02:00", kr:"돼지저금통"},
    {cn:"橋村筆房 (炸雞)", cat:"美食", note:"週一公休", hrs:"16:00 - 23:30", kr:"교촌필방"},
    {cn:"JO & DAWSON", cat:"咖啡甜點", note:"焦糖布丁名店", hrs:"12:00 - 21:00", kr:"조앤도슨"},
    {cn:"Dalmaji Plaza BBQ", cat:"美食", note:"最後點餐 01:00", hrs:"16:00 - 02:00", kr:"달마지 을지로점"},
    {cn:"龍龍麻辣桃源 (聖水店)", cat:"美食", note:"最後點餐 21:00", hrs:"16:00 - 22:00", kr:"용용선생 성수점"},
    {cn:"Jongsamyook (烤肉)", cat:"美食", note:"鐘路三街站", hrs:"14:00 - 23:30", kr:"종삼육"},
    {cn:"孫家一隻雞", cat:"美食", note:"隱藏版名店", hrs:"11:00 - 22:00", kr:"손가네닭한마리"},
    {cn:"統營清蒸牡蠣", cat:"美食", note:"季節限定", hrs:"11:00 - 22:00", kr:"통영굴찜"},
    {cn:"無垢屋 (聖水店)", cat:"美食", note:"聖水站分店", hrs:"11:30 - 21:00", kr:"무구 성수점"},
    {cn:"漢南洞土豆湯總店", cat:"美食", note:"必吃老店", hrs:"24 小時營業", kr:"한남동감자탕"},
    {cn:"Parole & Langue", cat:"咖啡甜點", note:"塔類甜點熱門店", hrs:"13:00 - 21:00", kr:"파롤앤랑그"},
    {cn:"Butty Sandwich House", cat:"咖啡甜點", note:"巧巴達三明治", hrs:"11:00 - 19:00", kr:"버티샌드위치하우스"},
    {cn:"雲蒸馬山奶奶燉安鱇魚", cat:"美食", note:"在地口碑店", hrs:"11:00 - 22:00", kr:"원조마산할매아구찜"},
    {cn:"hetras. (聖水店)", cat:"購物", note:"推薦 No.29, No.7, No.5", hrs:"11:00 - 20:00", kr:"헤트라스 성수플래그십스토어"},
    {cn:"newmix coffee (聖水)", cat:"咖啡甜點", note:"必買即溶咖啡伴手禮", hrs:"11:00 - 20:00", kr:"뉴믹스커피 성수"},
    {cn:"ADERERROR (聖水)", cat:"服飾", note:"旗艦概念店", hrs:"13:00 - 21:00", kr:"아더 성수 스페이스"},
    {cn:"BLUE ELEPHANT (聖水)", cat:"服飾", note:"平價墨鏡品牌", hrs:"11:00 - 20:00", kr:"블루엘리펀트 성수 플래그십스토어"},
    {cn:"fwee Agit (聖水)", cat:"彩妝", note:"必買布丁唇泥", hrs:"11:00 - 21:00", kr:"퓌 아지트 성수"},
    {cn:"DIOR 聖水", cat:"景點", note:"熱門地標拍照", hrs:"11:00 - 20:00", kr:"디올 성수"},
    {cn:"NYUNYU (聖水店)", cat:"服飾", note:"飾品購物聖地", hrs:"11:00 - 23:00", kr:"뉴뉴 성수점"},
    {cn:"Thingool (聖水店)", cat:"選物", note:"生活選物店", hrs:"11:00 - 21:00", kr:"띵굴스토어 성수점"},
    {cn:"KODAK DunDun 東大門店", cat:"服飾", note:"位於 DunDun 2 樓", hrs:"10:30 - 22:00", kr:"코닥어패럴 던던동대문점"},
    {cn:"ept (聖水/旗艦店)", cat:"服飾", note:"韓國熱門運動鞋", hrs:"11:00 - 20:00", kr:"이피티 성수 플래그십스토어"},
    {cn:"HAUS NOWHERE (聖水)", cat:"選物", note:"臘腸狗地標/新品牌", hrs:"11:00 - 21:00", kr:"하우스 성수"},
    {cn:"Thisisneverthat", cat:"服飾", note:"街頭潮流第一站", hrs:"12:00 - 21:00", kr:"디스이즈네버댓 홍대플래그십스토어"},
    {cn:"KITH Seoul", cat:"服飾", note:"潮流名店", hrs:"11:00 - 20:00", kr:"키스 서울"},
    {cn:"HUMAN MADE", cat:"服飾", note:"熱門潮牌", hrs:"11:00 - 20:00", kr:"휴먼메이드 성수"},
    {cn:"MUSINSA EMPTY", cat:"選物", note:"大型選品店", hrs:"11:00 - 20:00", kr:"무신사 엠프티 성수"},
    {cn:"清水堂 (Cheongsudang)", cat:"咖啡甜點", note:"益善洞竹林造景", hrs:"11:30 - 22:00", kr:"청수당"},
    {cn:"YM Coffee House", cat:"咖啡甜點", note:"教堂風格專業手沖", hrs:"12:00 - 22:00", kr:"YM COFFEE HOUSE"},
    {cn:"Cafe Layered (延南店)", cat:"咖啡甜點", note:"司康名店", hrs:"11:00 - 22:00", kr:"카페레이어드 연남점"},
    {cn:"Thanks Oat (綿羊咖啡)", cat:"咖啡甜點", note:"延南洞手工優格", hrs:"10:00 - 19:00", kr:"땡스오트 연남"},
    {cn:"today's enough", cat:"咖啡甜點", note:"週二公休", hrs:"12:00 - 20:00", kr:"오늘의 위로"},
    {cn:"Sohyeondang", cat:"咖啡甜點", note:"韓屋茶室", hrs:"11:00 - 20:00", kr:"소현당"},
    {cn:"artist bakery", cat:"咖啡甜點", note:"鹽可頌排隊名店", hrs:"08:00 - 20:00", kr:"아티스트베이커리 안국"},
    {cn:"29CM SEONGSU", cat:"選物", note:"線上選品實體店", hrs:"11:00 - 20:00", kr:"이구성수"},
    {cn:"Ground Seesaw 西村", cat:"展覽", note:"質感展覽空間", hrs:"10:00 - 19:00", kr:"그라운드시소 서촌"},
    {cn:"廣藏市場 156 號", cat:"雜貨", note:"購買韓國製棉被", hrs:"09:00 - 18:00", kr:"광장시장 156호"}
];


let html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首爾之旅 - Naver Map 快速儲存 (v5 修復版)</title>
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
        <h2>🇰🇷 Naver Map 快速儲存 (v5 修復版)</h2>
        <p style="color:#666; font-size:0.9em;">資料已內建，不需讀取外部檔案。</p>
    </div>
    <div class="container">
`;

data.forEach(item => {
    const link = `https://map.naver.com/p/search/${encodeURIComponent(item.kr)}`;
    html += `
    <div class="card">
        <div class="content">
            <span class="category">${item.cat}</span>
            <div class="cn-name">${item.cn}</div>
            <div class="kr-name">${item.kr}</div>
            ${item.note ? `<div class="note">💡 ${item.note}</div>` : ''}
            <div class="note" style="color:#aaa;">🕒 ${item.hrs || '未標示'}</div>
        </div>
        <div class="btn-group">
            <a href="${link}" target="_blank" class="btn">開啟地圖 ↗</a>
        </div>
    </div>
    `;
});

html += `</div></body></html>`;

fs.writeFileSync('Naver_Map_Desktop_v5_Fixed.html', html);

const fs = require('fs');

// 讀取現有 HTML
let html = fs.readFileSync('seoul-trip-complete.html', 'utf8');

// 新增景點（精簡格式）
const newPlaces = [
  {cn:"1人1杯",kr:"1人1杯",cat:"咖啡甜點",note:"絕美環景",hours:"11:00-21:00",zone:"恩平區",lat:37.641,lon:126.938},
  {cn:"43 Gyeongdongsijang-ro",kr:"43 Gyeongdongsijang-ro 12-gil",cat:"住宿",note:"住宿",hours:"Check-in 15:00",zone:"東大門",lat:37.582,lon:127.043},
  {cn:"Dotom",kr:"Dotom",cat:"美食",note:"在地人下班後會來吃的烤肉店",hours:"17:00-23:00",zone:"建大/廣津區",lat:37.556,lon:127.078,must:"推薦：烤肉",price:"₩20,000-30,000/人"},
  {cn:"손칼국수보쌈",kr:"훼미리손칼국수보쌈",cat:"美食",note:"菜包肉 刀削麵",hours:"11:00-22:00",zone:"聖水洞",lat:37.549,lon:127.045,must:"必點：菜包肉、刀削麵",price:"₩12,000-18,000"},
  {cn:"自然島鹽麵包",kr:"Jayeondo Sogeumppang",cat:"咖啡甜點",note:"鹽麵包名店",hours:"08:00-20:00",zone:"聖水洞",lat:37.542,lon:127.055,must:"必買：鹽麵包",price:"₩3,000-5,000"},
  {cn:"Kyewol Gomtang",kr:"Kyewol Gomtang",cat:"美食",note:"湯飯",hours:"24小時",zone:"聖水洞",lat:37.540,lon:127.048,must:"招牌：牛骨湯飯",price:"₩10,000-13,000"},
  {cn:"Thweet Seongsu",kr:"Thweet Seongsu",cat:"咖啡甜點",note:"威士忌冰淇淋",hours:"13:00-22:00",zone:"聖水洞",lat:37.545,lon:127.052,must:"必點：威士忌冰淇淋",price:"₩8,000-12,000"},
  {cn:"MilkyShop Seongsu",kr:"MilkyShop Seongsu Store",cat:"購物",note:"焦糖奶油餅乾伴手禮",hours:"11:00-20:00",zone:"聖水洞",lat:37.544,lon:127.051,must:"必買：焦糖奶油餅乾",price:"₩12,000-18,000"},
  {cn:"祖傳三代馬鈴薯排骨湯",kr:"소문난 성수 감자탕",cat:"美食",note:"24小時營業",hours:"24小時",zone:"聖水洞",lat:37.543,lon:127.054,must:"招牌：馬鈴薯排骨湯",price:"₩13,000-18,000"},
  {cn:"29cm.home",kr:"29cm.home",cat:"選物",note:"質感家居選物店 gelato",hours:"12:00-21:00",zone:"聖水洞",lat:37.543,lon:127.056,must:"推薦：開心果gelato、設計選物",price:"₩5,000-50,000"},
  {cn:"LOE SEONGSU",kr:"로에 성수",cat:"購物",note:"韓國小眾品牌香水 免費刻字",hours:"11:00-20:00",zone:"聖水洞",lat:37.542,lon:127.056,must:"必買：小眾香水、免費刻字服務",price:"₩50,000-120,000"},
  {cn:"Standard Bread",kr:"Standard Bread",cat:"咖啡甜點",note:"鐵鍋焦糖法式吐司",hours:"08:00-19:00",zone:"聖水洞",lat:37.542,lon:127.061,must:"必點：鐵鍋焦糖法式吐司",price:"₩6,000-15,000"},
  {cn:"Neungdong Minari",kr:"Neungdong Minari Seongsu",cat:"美食",note:"Hebe東海來吃過",hours:"10:00-22:00",zone:"聖水洞",lat:37.543,lon:127.054,must:"招牌：水芹牛骨湯",price:"₩12,000-15,000"},
  {cn:"STAFF PICKS",kr:"STAFF PICKS",cat:"咖啡甜點",note:"美咖啡廳",hours:"10:00-21:00",zone:"首爾市區",lat:37.577,lon:126.968},
  {cn:"Milestone Coffee",kr:"Milestone Coffee Hannam",cat:"咖啡甜點",note:"漢南洞潮流區",hours:"09:00-20:00",zone:"漢南/梨泰院",lat:37.538,lon:127.003},
  {cn:"COFFEE & CIGARETTES",kr:"COFFEE & CIGARETTES",cat:"咖啡甜點",note:"17樓高空咖啡",hours:"11:00-23:00",zone:"明洞/鍾路",lat:37.563,lon:126.974},
  {cn:"Blue Bottle 三清",kr:"Blue Bottle Samcheong Cafe",cat:"咖啡甜點",note:"風景很好",hours:"08:00-20:00",zone:"三清洞",lat:37.580,lon:126.981},
  {cn:"뭍 MUUT",kr:"뭍 성수 플래그쉽 스토어",cat:"選物",note:"設計品牌",hours:"12:00-21:00",zone:"聖水洞",lat:37.541,lon:127.060},
  {cn:"國立現代美術館",kr:"國立現代美術館 首爾 MMCA",cat:"展覽",note:"韓國當代藝術最高殿堂",hours:"10:00-18:00",zone:"三清洞",lat:37.579,lon:126.980,must:"推薦：當期展覽",price:"₩5,000-10,000"},
  {cn:"首爾市立美術館",kr:"首爾市立美術館",cat:"展覽",note:"美術館",hours:"10:00-20:00",zone:"明洞/鍾路",lat:37.564,lon:126.974},
  {cn:"眞味食堂",kr:"眞味食堂",cat:"美食",note:"米其林認證 醬蟹定食",hours:"11:00-22:00",zone:"首爾市區",lat:37.551,lon:126.956,must:"招牌：醬蟹定食",price:"₩45,000/人"},
  {cn:"Ground Seesaw Central",kr:"Ground Seesaw Central",cat:"展覽",note:"展覽空間",hours:"11:00-19:00",zone:"首爾市區",lat:37.558,lon:126.974},
  {cn:"Musinsa Standard",kr:"Musinsa Standard Seongsu",cat:"服飾",note:"像 uniqlo 便宜發熱衣",hours:"11:00-21:00",zone:"聖水洞",lat:37.542,lon:127.059,must:"必買：發熱衣、基本款",price:"₩10,000-50,000"},
  {cn:"Malbang Gukbap",kr:"Malbang Gukbap - Seongsu",cat:"美食",note:"湯飯",hours:"08:00-21:00",zone:"聖水洞",lat:37.548,lon:127.064,must:"招牌：湯飯",price:"₩9,000-12,000"},
  {cn:"papier prost",kr:"파피어프로스트",cat:"購物",note:"文具店",hours:"12:00-20:00",zone:"西村",lat:37.580,lon:126.969},
  {cn:"通仁市場",kr:"通仁市場",cat:"景點",note:"可以買塑膠餐盒",hours:"09:00-19:00",zone:"西村",lat:37.581,lon:126.971},
  {cn:"arkisto",kr:"아르키스토",cat:"購物",note:"逛街一條街",hours:"11:00-20:00",zone:"西村",lat:37.582,lon:126.972},
  {cn:"MONOHA Seochon",kr:"모노하 서촌",cat:"購物",note:"逛街區域",hours:"11:00-20:00",zone:"西村",lat:37.580,lon:126.972},
  {cn:"大林美術館",kr:"大林美術館",cat:"展覽",note:"攝影展美術館",hours:"11:00-19:00",zone:"西村",lat:37.578,lon:126.973},
  {cn:"Dancing grandma",kr:"Dancing grandma",cat:"購物",note:"手織品",hours:"12:00-18:00",zone:"西村",lat:37.578,lon:126.971},
  {cn:"SOLSOT",kr:"SOLSOT",cat:"美食",note:"釜飯",hours:"11:30-21:00",zone:"西村",lat:37.578,lon:126.971,must:"招牌：釜飯",price:"₩12,000-18,000"},
  {cn:"ETC Seoul Seochon",kr:"ETC Seoul Seochon",cat:"選物",note:"選品店",hours:"12:00-20:00",zone:"西村",lat:37.577,lon:126.969},
  {cn:"Folki",kr:"Folki",cat:"咖啡甜點",note:"漂亮咖啡廳",hours:"10:00-21:00",zone:"西村",lat:37.576,lon:126.969},
  {cn:"PIZZA SLICE SEOUL",kr:"PIZZA SLICE SEOUL",cat:"美食",note:"披薩",hours:"12:00-22:00",zone:"聖水洞",lat:37.543,lon:127.062,must:"推薦：披薩片",price:"₩5,000-8,000"},
  {cn:"AIRDROP COFFEE",kr:"AIRDROP COFFEE SEONGSU",cat:"咖啡甜點",note:"聖水咖啡",hours:"09:00-20:00",zone:"聖水洞",lat:37.544,lon:127.055},
  {cn:"Downtowner Anguk",kr:"Downtowner Anguk",cat:"美食",note:"酪梨漢堡",hours:"11:00-21:00",zone:"安國/三清",lat:37.577,lon:126.986,must:"招牌：酪梨漢堡",price:"₩12,000-16,000"}
];

// 找到 D 陣列並替換
const dataMatch = html.match(/var D=\[([\s\S]*?)\];/);
if (dataMatch) {
    // 解析現有資料
    const existingDataStr = dataMatch[1];
    
    // 將新資料轉換成精簡格式字串
    const newDataStr = newPlaces.map(p => {
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
    
    // 合併資料
    const mergedData = existingDataStr + ',' + newDataStr;
    
    // 替換
    html = html.replace(/var D=\[([\s\S]*?)\];/, `var D=[${mergedData}];`);
    
    // 保存
    fs.writeFileSync('seoul-trip-v5-88places.html', html);
    console.log('✅ 已生成包含 88 個景點的新檔案：seoul-trip-v5-88places.html');
} else {
    console.log('❌ 找不到資料陣列');
}

// 解析 CSV 並整理新景點
const fs = require('fs');

const csvData = `#,標題,描述,經緯度,Naver Map 連結
1,1人1杯,絕美環景,"37.6410605,126.9378889",https://map.naver.com/p/search/37.6410605%2C126.9378889
2,43 Gyeongdongsijang-ro 12-gil,🏠🏠住宿,"37.5822619,127.0430922",https://map.naver.com/p/search/37.5822619%2C127.0430922
6,Dotom,在地人下班後會來吃的烤肉店,"37.5563161,127.0779539",https://map.naver.com/p/search/37.5563161%2C127.0779539
10,훼미리손칼국수보쌈,菜包肉 刀削麵,"37.5494775,127.0446801",https://map.naver.com/p/search/37.5494775%2C127.0446801
11,Jayeondo Sogeumppang (Salt Bread),自然島鹽麵包,"37.5423017,127.0554582",https://map.naver.com/p/search/37.5423017%2C127.0554582
12,Kyewol Gomtang,湯飯,"37.5395267,127.0476224",https://map.naver.com/p/search/37.5395267%2C127.0476224
13,Thweet Seongsu,THWEET威士忌冰淇淋,"37.5446613,127.051779",https://map.naver.com/p/search/37.5446613%2C127.051779
17,MilkyShop Seongsu Store,最有名伴手禮「焦糖奶油餅乾」,"37.5439021,127.0506952",https://map.naver.com/p/search/37.5439021%2C127.0506952
20,祖傳三代馬鈴薯排骨湯,소문난 성수 감자탕 24H,"37.5428241,127.0543732",https://map.naver.com/p/search/37.5428241%2C127.0543732
25,29cm.home,質感家居選物店 開心果gelato,"37.5425599,127.0557579",https://map.naver.com/p/search/37.5425599%2C127.0557579
27,로에 성수(LOE SEONGSU),韓國小眾品牌香水 免費刻字,"37.5424182,127.0562153",https://map.naver.com/p/search/37.5424182%2C127.0562153
30,Standard Bread,烘焙咖啡｜鐵鍋焦糖法式吐司,"37.5416751,127.0611416",https://map.naver.com/p/search/37.5416751%2C127.0611416
31,Neungdong Minari Seongsu,連Hebe東海都來吃的水芹牛骨湯,"37.542748,127.0539607",https://map.naver.com/p/search/37.542748%2C127.0539607
33,STAFF PICKS,美咖啡廳,"37.5774665,126.9679737",https://map.naver.com/p/search/37.5774665%2C126.9679737
36,Milestone Coffee Hannam,旁邊是漢南洞潮流區,"37.5378721,127.0026652",https://map.naver.com/p/search/37.5378721%2C127.0026652
42,COFFEE & CIGARETTES,17 樓的高空咖啡,"37.5627161,126.9740199",https://map.naver.com/p/search/37.5627161%2C126.9740199
45,Blue Bottle Samcheong Cafe,風景很好的樣子,"37.5801151,126.9808482",https://map.naver.com/p/search/37.5801151%2C126.9808482
46,뭍 성수 플래그쉽 스토어 (MUUT),-,"37.5410508,127.0595319",https://map.naver.com/p/search/37.5410508%2C127.0595319
48,國立現代美術館 首爾 MMCA,韓國當代藝術最高殿堂,"37.5788333,126.9804281",https://map.naver.com/p/search/37.5788333%2C126.9804281
40,首爾市立美術館,美術館,"37.5640625,126.9738125",https://map.naver.com/p/search/37.5640625%2C126.9738125
55,眞味食堂,米其林認證 醬蟹定食₩45000/人,"37.5505634,126.9557715",https://map.naver.com/p/search/37.5505634%2C126.9557715
62,Ground Seesaw Central,展覽：yosigo miles to go,"37.5578756,126.9744016",https://map.naver.com/p/search/37.5578756%2C126.9744016
70,Musinsa Standard Seongsu,很像 uniqlo 便宜發熱衣,"37.5415471,127.058537",https://map.naver.com/p/search/37.5415471%2C127.058537
75,Malbang Gukbap - Seongsu,湯飯,"37.5477866,127.0636819",https://map.naver.com/p/search/37.5477866%2C127.0636819
77,파피어프로스트 papier prost,文具店,"37.5803499,126.9691643",https://map.naver.com/p/search/37.5803499%2C126.9691643
78,通仁市場,可以買塑膠餐盒 1-2人份,"37.5807649,126.9706756",https://map.naver.com/p/search/37.5807649%2C126.9706756
79,아르키스토 arkisto,逛街一條街,"37.5822977,126.9718062",https://map.naver.com/p/search/37.5822977%2C126.9718062
80,모노하 서촌 (MONOHA Seochon),逛街～這條路上很多可以逛,"37.5795295,126.9722455",https://map.naver.com/p/search/37.5795295%2C126.9722455
81,大林美術館,攝影展美術館,"37.5775023,126.9733626",https://map.naver.com/p/search/37.5775023%2C126.9733626
82,Dancing grandma,手織品,"37.5775705,126.9711817",https://map.naver.com/p/search/37.5775705%2C126.9711817
83,SOLSOT,釜飯,"37.5780768,126.9714806",https://map.naver.com/p/search/37.5780768%2C126.9714806
84,ETC Seoul Seochon,選品店,"37.5767673,126.9693415",https://map.naver.com/p/search/37.5767673%2C126.9693415
85,Folki,漂亮咖啡廳,"37.5764692,126.9687697",https://map.naver.com/p/search/37.5764692%2C126.9687697
87,PIZZA SLICE SEOUL,-,"37.5430944,127.061671",https://map.naver.com/p/search/37.5430944%2C127.061671
89,AIRDROP COFFEE SEONGSU,-,"37.544172,127.0545656",https://map.naver.com/p/search/37.544172%2C127.0545656
91,Downtowner Anguk,酪梨漢堡 連鎖店,"37.577463,126.9862466",https://map.naver.com/p/search/37.577463%2C126.9862466`;

function categorize(name, desc) {
    const text = (name + ' ' + desc).toLowerCase();
    if (text.includes('咖啡') || text.includes('coffee') || text.includes('cafe') || text.includes('甜點') || text.includes('gelato') || text.includes('冰淇淋') || text.includes('麵包') || text.includes('bread')) return '咖啡甜點';
    if (text.includes('美術館') || text.includes('展覽') || text.includes('museum')) return '展覽';
    if (text.includes('購物') || text.includes('選物') || text.includes('uniqlo') || text.includes('逛街') || text.includes('文具') || text.includes('手織') || text.includes('香水')) return '購物';
    if (text.includes('住宿') || text.includes('🏠')) return '住宿';
    if (text.includes('烤肉') || text.includes('刀削麵') || text.includes('湯飯') || text.includes('牛骨湯') || text.includes('生魚片') || text.includes('菜包肉') || text.includes('米其林') || text.includes('餐') || text.includes('飯') || text.includes('食堂')) return '美食';
    if (text.includes('公園')) return '景點';
    return '其他';
}

function getZone(lat, lon, name) {
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    
    // 聖水洞 (대략)
    if (lat >= 37.54 && lat <= 37.55 && lon >= 127.04 && lon <= 127.07) return '聖水洞';
    // 弘大/延南
    if (lat >= 37.55 && lat <= 37.57 && lon >= 126.91 && lon <= 126.93) return '弘大/延南';
    // 明洞/鍾路
    if (lat >= 37.56 && lat <= 37.58 && lon >= 126.97 && lon <= 127.01) return '明洞/鍾路';
    // 漢南/梨泰院
    if (lat >= 37.53 && lat <= 37.54 && lon >= 126.99 && lon <= 127.01) return '漢南/梨泰院';
    // 江南
    if (lat >= 37.49 && lat <= 37.52 && lon >= 127.02 && lon <= 127.06) return '江南';
    
    return '首爾市區';
}

const lines = csvData.trim().split('\n');
const result = [];

for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/^\d+,([^,]+),([^,]+),"([\d.]+),([\d.]+)"/);
    if (match) {
        const [, name, desc, lat, lon] = match;
        const cat = categorize(name, desc);
        const zone = getZone(lat, lon, name);
        result.push({
            cn: name,
            kr: name,
            cat: cat,
            note: desc.replace('-', '').trim(),
            hours: '營業時間請確認',
            zone: zone,
            lat: parseFloat(lat),
            lon: parseFloat(lon)
        });
    }
}

console.log(JSON.stringify(result, null, 2));

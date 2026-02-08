const fs = require('fs');

// Load extracted locations
const rawLocations = JSON.parse(fs.readFileSync('extracted_locations.json', 'utf-8'));

// Korean name mappings (for Naver search)
const koreanNames = {
  "1\\uc0人1杯": "1인1잔 은평한옥마을",
  "恩平韓屋村": "은평한옥마을",
  "第三隧道": "제3땅굴",
  "Hotel Charis": "호텔 카리스",
  "Dotom": "도톰 성수",
  "樂天超級市場 世界塔店": "롯데마트 월드타워점",
  "大使館換錢所": "대사관환전소",
  "Maljillo": "말질로",
  "훼미리손칼국수보쌈": "훼미리손칼국수보쌈",
  "Jayeondo Sogeumppang (Salt Bread) in Seongsu": "자연도소금빵 성수점",
  "Kyewol Gomtang": "계월곰탕",
  "Thweet Seongsu": "트윗 성수",
  "仁王山": "인왕산",
  "Mangrove Dongdaemun": "맹그로브 동대문",
  "Terarosa Posco Centre Branch": "테라로사 포스코센터점",
  "MilkyShop Seongsu Store": "밀키샵 성수점",
  "Kodak Corner Shop": "코닥 코너숍 성수",
  "Ediya Coffee Lab.": "이디야 커피랩",
  "祖傳三代馬鈴薯排骨湯": "소문난 성수 감자탕",
  "Hollys Coffee Hongik Univ. station branch": "할리스커피 홍대입구역점",
  "Debunk": "디벙크",
  "Blue Elephant Space Seongsu": "블루엘리펀트 스페이스 성수",
  "브라우터 강남 신세계백화점": "브라우터 강남 신세계백화점",
  "29cm.home": "이구홈 성수",
  "Cociety": "코사이어티",
  "로에 성수(LOE SEONGSU)": "로에 성수",
  "HAUS NOWHERE SEOUL": "하우스노웨어 서울",
  "Artist Bakery": "아티스트베이커리",
  "Standard Bread": "스탠다드브레드 성수",
  "Neungdong Minari Seongsu": "능동미나리 성수점",
  "소현당 게스트하우스": "소현당 게스트하우스",
  "STAFF PICKS": "스태프픽스 서촌",
  "THANKS, OAT Yeonnam": "땡스오트 연남",
  "Layered Yeonnam": "레이어드 연남",
  "Milestone Coffee Hannam": "마일스톤 커피 한남",
  "YM COFFEE PROJECT 연신내": "YM커피프로젝트 연신내",
  "清水堂": "청수당",
  "MUSINSA EMPTY SEONGSU": "무신사 엠프티 성수",
  "首爾市立美術館": "서울시립미술관",
  "Kith Seoul": "키스 서울",
  "COFFEE & CIGARETTES": "커피앤시가렛",
  "thisisneverthat Seongsu Flagship": "디스이즈네버댓 성수 플래그십",
  "EPT 성수점": "EPT 성수점",
  "Blue Bottle Samcheong Cafe": "블루보틀 삼청카페",
  "뭍 성수 플래그쉽 스토어(MUUT SEONGSU FLAGSHIP STORE)": "뭍 성수 플래그십스토어",
  "NYU NYU": "뉴뉴 성수",
  "國立現代美術館 首爾 MMCA": "국립현대미술관 서울",
  "fwee Agit Yeonnam": "휘 아지트 연남",
  "fwee Agit - Seongsu": "휘 아지트 성수",
  "BLUE ELEPHANT SEONGSU FLAGSHIP STORE": "블루엘리펀트 성수 플래그십",
  "ADER ERROR SEONGSU": "아더에러 성수",
  "뉴믹스커피 (New Mix coffee)": "뉴믹스커피 성수",
  "hetras Seongsu": "헤트라스 성수",
  "眞味食堂": "진미식당",
  "Butty Sandwich House": "버티 샌드위치 하우스",
  "Parole & Langue": "파롤에랑그",
  "Ground Seesaw Seochon": "그라운드시소 서촌",
  "통영굴찜": "통영굴찜",
  "Jongsamyook": "종삼육",
  "달맞이 광장 바베큐": "달맞이 광장 바베큐",
  "Ground Seesaw Central": "그라운드시소 센트럴",
  "JO & DAWSON": "조앤도슨",
  "Kyochon Pilbang": "교촌필방",
  "小豬存錢桶（石頭烤肉）": "돼지저금통 홍대점",
  "無垢屋": "무구옥",
  "神仙雪濃湯": "신선설농탕",
  "倫敦貝果博物館 安國店": "런던베이글뮤지엄 안국",
  "青瓦屋": "청와옥",
  "Musinsa Standard Seongsu": "무신사 스탠다드 성수",
  "廣藏市場": "광장시장",
  "漢南洞24小時馬鈴薯排骨湯": "한남동 24시 감자탕",
  "孫家一隻雞": "손가네한마리닭",
  "Malbang Gukbap - Seongsu": "말방국밥 성수",
  "용용선생 마라도원": "용용선생 마라도원",
  "파피어프로스트 papier prost": "파피어프로스트",
  "通仁市場": "통인시장",
  "아르키스토 arkisto": "아르키스토",
  "모노하 서촌 (MONOHA Seochon)": "모노하 서촌",
  "大林美術館": "대림미술관",
  "Dancing grandma": "댄싱그랜마",
  "SOLSOT": "솔솥",
  "ETC Seoul Seochon": "이티씨서울 서촌",
  "Folki": "폴키",
  "首爾林公園": "서울숲",
  "PIZZA SLICE SEOUL": "피자슬라이스 서울",
  "朝朝刀削麵": "조조칼국수",
  "AIRDROP COFFEE SEONGSU": "에어드롭커피 성수",
  "纛島漢江公園雪橇場": "뚝섬한강공원 눈썰매장",
  "Downtowner Anguk": "다운타우너 안국점",
  "仁川國際機場": "인천국제공항",
  "Hwanho Park": "환호공원",
  "뽀뽀뽀 아구찜해물집": "뽀뽀뽀 아구찜해물집"
};

// Categorize locations
function getCategory(name, note) {
  const n = (name + ' ' + note).toLowerCase();
  
  // Hotels
  if (n.includes('hotel') || n.includes('住宿') || n.includes('guest') || n.includes('hostel')) return 'hotel';
  
  // Sights
  if (n.includes('museum') || n.includes('美術館') || n.includes('公園') || n.includes('park') || 
      n.includes('山') || n.includes('market') || n.includes('市場') || n.includes('隧道') ||
      n.includes('機場') || n.includes('airport') || n.includes('mmca') || n.includes('韓屋') ||
      n.includes('展覽') || n.includes('雪橇')) return 'sight';
  
  // Cafes
  if (n.includes('coffee') || n.includes('cafe') || n.includes('咖啡') || n.includes('커피') ||
      n.includes('bakery') || n.includes('bread') || n.includes('麵包') || n.includes('甜點') ||
      n.includes('司康') || n.includes('tart') || n.includes('布丁') || n.includes('蛋糕') ||
      n.includes('貝果') || n.includes('bagel') || n.includes('croissant') || n.includes('可頌')) return 'cafe';
  
  // Shopping
  if (n.includes('shop') || n.includes('store') || n.includes('購物') || n.includes('品牌') ||
      n.includes('musinsa') || n.includes('무신사') || n.includes('flagship') || n.includes('旗艦') ||
      n.includes('error') || n.includes('kith') || n.includes('文具') || n.includes('香水') ||
      n.includes('選品') || n.includes('潮流') || n.includes('逛街') || n.includes('彩妝') ||
      n.includes('elephant') || n.includes('hetras') || n.includes('fwee') || n.includes('換錢')) return 'shop';
  
  // Default to food
  return 'food';
}

// Clean name
function cleanName(name) {
  return name.replace(/\\uc0/g, '').replace(/\\n/g, ' ').replace(/\\\\/g, '').trim();
}

// Process locations
const processed = rawLocations.map(loc => {
  const name = cleanName(loc.name);
  const note = (loc.note || '').replace(/\\\\n/g, ' ').replace(/\\/g, '').trim();
  const korean = koreanNames[loc.name] || koreanNames[name] || '';
  const category = getCategory(name, note);
  
  return {
    name,
    korean,
    note: note.substring(0, 100),
    lat: loc.lat,
    lon: loc.lon,
    category
  };
});

// Generate JavaScript array for HTML
console.log('const newLocations = [');
processed.forEach((loc, i) => {
  const comma = i < processed.length - 1 ? ',' : '';
  console.log(`  { name: "${loc.name.replace(/"/g, '\\"')}", korean: "${loc.korean}", category: "${loc.category}", lat: ${loc.lat}, lon: ${loc.lon}, note: "${loc.note.replace(/"/g, '\\"')}" }${comma}`);
});
console.log('];');

// Summary
const cats = {};
processed.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
console.log('\n// Summary:');
Object.entries(cats).forEach(([k, v]) => console.log(`// ${k}: ${v}`));
console.log(`// Total: ${processed.length}`);

// Save for reference
fs.writeFileSync('processed_locations.json', JSON.stringify(processed, null, 2));

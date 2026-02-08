const fs = require('fs');

const outFile = 'Seoul_Trip_Ultimate.html';
const jsonFile = 'locations_with_coords.json';

// 1. Load Data
let locations = [];
try {
    locations = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
} catch (e) {
    console.error("Could not read locations file. Run geocode_all.js first.");
    process.exit(1);
}

// 2. Manual Fixes for Failed Geocoding
const fixes = {
    "뉴뉴 성수 (NYUNYU)": { lat: 37.5445, lon: 127.0560 }, // Approx Seongsu
    "하우스 노웨어 (HAUS NOWHERE)": { lat: 37.5410, lon: 127.0590 }, // Approx
    "코사이어티 서울숲 (Cociety)": { lat: 37.5465, lon: 127.0435 },
    "디벙크 (Debunk)": { lat: 37.5485, lon: 126.9170 } // Hapjeong
};

// 3. Accommodations (Hardcoded)
const accommodations = [
    {
        name: "Mangrove Dongdaemun (Co-living)",
        kr_name: "맹그로브 동대문",
        category: "住宿",
        note: "🏠 熱門 Co-living, 適合數位遊牧",
        hours: "Check-in 15:00",
        address: "서울 중구 퇴계로 334",
        lat: 37.5651,
        lon: 127.0078
    },
    {
        name: "Local Stitch Seogyo",
        kr_name: "로컬스티치 크리에이터 타운 서교",
        category: "住宿",
        note: "🏠 弘大商圈, 設計師風格",
        hours: "Check-in 15:00",
        address: "서울 마포구 월드컵북로5길 41",
        lat: 37.5562,
        lon: 126.9167
    },
    {
        name: "L7 Hongdae",
        kr_name: "L7 홍대",
        category: "住宿",
        note: "🏨 弘大入口站旁, 交通便利",
        hours: "Check-in 15:00",
        address: "서울 마포구 양화로 141",
        lat: 37.5552,
        lon: 126.9216
    }
];

// 4. Merge & Process
// Apply fixes
locations.forEach(loc => {
    // Check if coords are missing or null
    if (!loc.lat && fixes[loc.name]) {
        loc.lat = fixes[loc.name].lat;
        loc.lon = fixes[loc.name].lon;
    } else if (!loc.lat) {
        // Fallback for any others? Mapo default or Center Seoul
        if (loc.address.includes('마포')) { loc.lat = 37.556; loc.lon = 126.923; } // Hongdae
        else if (loc.address.includes('성동')) { loc.lat = 37.544; loc.lon = 127.056; } // Seongsu
        else { loc.lat = 37.566; loc.lon = 126.978; } // City Hall
    }
    
    // Add zone logic
    loc.zone = getZone(loc.address);
});

// Add Accommodations
accommodations.forEach(acc => {
    acc.zone = getZone(acc.address);
    locations.push(acc);
});

function getZone(addr) {
    if (!addr) return "首爾";
    if (addr.includes('마포')) return "弘大/延南";
    if (addr.includes('성동')) return "聖水洞";
    if (addr.includes('종로') || addr.includes('중구')) return "明洞/鍾路";
    if (addr.includes('강남') || addr.includes('서초')) return "江南";
    if (addr.includes('용산')) return "漢南/梨泰院";
    if (addr.includes('영등포')) return "汝矣島";
    return "首爾市區";
}

// 5. Generate HTML
const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Seoul Trip Ultimate 🇰🇷</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #1877F2;
            --bg: #F0F2F5;
            --white: #FFFFFF;
            --text: #050505;
            --text-sec: #65676B;
            --food: #ff6b6b;
            --cafe: #48dbfb;
            --shop: #a29bfe;
            --work: #57606f;
            --accom: #1dd1a1;
            --attr: #ff9f43;
        }
        
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; font-family: 'Noto Sans TC', sans-serif; background: var(--bg); color: var(--text); padding-bottom: 80px; }
        
        /* Header */
        .app-header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 15px 20px;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .app-title { font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 8px; }
        .map-toggle-btn {
            background: #eee;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            transition: 0.2s;
        }
        .map-toggle-btn.active { background: var(--primary); color: white; }

        /* Sticky Tabs */
        .tabs-container {
            position: sticky;
            top: 67px; /* Height of header approx */
            z-index: 900;
            background: var(--bg);
            padding: 10px 0;
            overflow-x: auto;
            white-space: nowrap;
            -ms-overflow-style: none;
            scrollbar-width: none;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .tabs-container::-webkit-scrollbar { display: none; }
        
        .tab-btn {
            display: inline-block;
            margin-left: 12px;
            padding: 8px 16px;
            background: var(--white);
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-sec);
            border: 1px solid #ddd;
            cursor: pointer;
            transition: 0.2s;
        }
        .tab-btn:last-child { margin-right: 12px; }
        .tab-btn.active {
            background: var(--text);
            color: white;
            border-color: var(--text);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* Container */
        .container { max-width: 600px; margin: 0 auto; padding: 10px 15px; }

        /* Cards */
        .card {
            background: var(--white);
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.03);
            transition: 0.2s;
        }
        .card:active { transform: scale(0.98); }
        
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .card-badges { display: flex; gap: 6px; flex-wrap: wrap; }
        .badge { font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; color: white; font-weight: 600; }
        .badge.zone { background: #eee; color: #555; }
        
        /* Category Colors */
        .cat-美食 { background: var(--food); }
        .cat-早午餐 { background: #feca57; color: #333; }
        .cat-咖啡甜點 { background: var(--cafe); color: #333; }
        .cat-購物, .cat-選物, .cat-服飾, .cat-彩妝, .cat-雜貨 { background: var(--shop); }
        .cat-Work, .cat-展覽 { background: var(--work); }
        .cat-住宿 { background: var(--accom); }
        .cat-景點 { background: var(--attr); }

        .place-name-cn { font-size: 1.15rem; font-weight: 700; color: #111; margin-bottom: 4px; line-height: 1.3; }
        .place-name-kr { font-size: 0.9rem; color: #777; font-weight: 500; margin-bottom: 10px; font-family: "Malgun Gothic", sans-serif; }
        
        .info-row { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #555; margin-bottom: 4px; }
        
        .actions { margin-top: 15px; display: flex; gap: 10px; }
        .action-btn {
            flex: 1;
            padding: 10px;
            text-align: center;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: 0.2s;
        }
        .btn-google { background: #e8f0fe; color: #1967d2; }
        .btn-naver { background: #e0f8eb; color: #03c75a; }
        .btn-google:active { background: #d2e3fc; }
        .btn-naver:active { background: #b8f0d0; }

        /* Map View */
        #map-container {
            position: fixed;
            top: 60px; /* Below header */
            left: 0;
            width: 100%;
            height: calc(100% - 60px);
            background: white;
            z-index: 800;
            display: none; /* Hidden by default */
            opacity: 0;
            transition: opacity 0.3s;
        }
        #map-container.visible { display: block; opacity: 1; }
        #map { width: 100%; height: 100%; }
        
        /* Map Popup Styles */
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .popup-title { font-weight: bold; font-size: 1rem; margin-bottom: 5px; }
        .popup-cat { font-size: 0.8rem; color: #777; }
        .popup-nav { display: block; margin-top: 8px; background: #03C75A; color: white; text-align: center; padding: 6px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; }

        /* Floating Nav for Mobile (Optional) */
        .nav-bar {
            display: none; /* Maybe overkill */
        }
    </style>
</head>
<body>

    <div class="app-header">
        <div class="app-title">🇰🇷 Seoul Trip</div>
        <button class="map-toggle-btn" onclick="toggleMode()">🗺️</button>
    </div>

    <div class="tabs-container" id="category-tabs">
        <div class="tab-btn active" onclick="filter('all')">全部</div>
        <div class="tab-btn" onclick="filter('美食')">美食</div>
        <div class="tab-btn" onclick="filter('咖啡甜點')">咖啡/甜點</div>
        <div class="tab-btn" onclick="filter('購物')">購物/逛街</div>
        <div class="tab-btn" onclick="filter('Work')">Work</div>
        <div class="tab-btn" onclick="filter('住宿')">住宿</div>
        <div class="tab-btn" onclick="filter('景點')">景點</div>
    </div>

    <!-- Map View -->
    <div id="map-container">
        <div id="map"></div>
    </div>

    <!-- List View -->
    <div class="container" id="list-container">
        ${locations.map((loc, index) => {
            // Clean category for class
            let catClass = 'cat-' + loc.category.split(' ')[0]; // Take first word if multiple
            if (loc.category.includes('Work')) catClass = 'cat-Work';
            if (loc.category.includes('服飾') || loc.category.includes('選物')) catClass = 'cat-購物';

            return `
        <div class="card" data-cat="${loc.category}" data-zone="${loc.zone}">
            <div class="card-header">
                <div class="card-badges">
                    <span class="badge ${catClass}">${loc.category}</span>
                    <span class="badge zone">${loc.zone}</span>
                </div>
            </div>
            <div class="place-name-cn">${loc.name}</div>
            <div class="place-name-kr">${loc.kr_name || loc.name.split('(')[0]}</div> <!-- Fallback if no kr_name in object (CSV parser put it in name sometimes) -->
            
            ${loc.note ? `<div class="info-row">💡 ${loc.note}</div>` : ''}
            ${loc.hours ? `<div class="info-row">🕒 ${loc.hours}</div>` : ''}
            
            <div class="actions">
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name)}" target="_blank" class="action-btn btn-google">
                    Google
                </a>
                <a href="https://map.naver.com/p/search/${encodeURIComponent(loc.kr_name || loc.name)}" target="_blank" class="action-btn btn-naver">
                    Naver
                </a>
            </div>
        </div>`;
        }).join('')}
        
        <div style="text-align:center; margin-top:40px; color:#aaa; font-size:0.8rem;">
            Made with OpenClaw • Night Shift Mode 🌙
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
        const places = ${JSON.stringify(locations)};
        let map, markers = [];
        let isMapMode = false;

        function initMap() {
            if (map) return;
            
            // Default center (Seoul City Hall)
            map = L.map('map').setView([37.5665, 126.9780], 12);
            
            // CartoDB Voyager (Nice and clean for apps)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Add Markers
            places.forEach(p => {
                if(p.lat && p.lon) {
                    const marker = L.marker([p.lat, p.lon]).addTo(map);
                    
                    const popupHtml = \`
                        <div style="text-align:center; min-width:150px;">
                            <div class="popup-title">\${p.name}</div>
                            <div class="popup-cat">\${p.category} | \${p.zone}</div>
                            <a href="https://map.naver.com/p/search/\${encodeURIComponent(p.kr_name || p.name)}" target="_blank" class="popup-nav">
                                Naver 導航
                            </a>
                        </div>
                    \`;
                    
                    marker.bindPopup(popupHtml);
                    markers.push({marker: marker, data: p});
                }
            });
        }

        function toggleMode() {
            const mapContainer = document.getElementById('map-container');
            const listContainer = document.getElementById('list-container');
            const tabs = document.getElementById('category-tabs'); // Keep tabs visible? Or hide?
            const btn = document.querySelector('.map-toggle-btn');
            
            isMapMode = !isMapMode;
            
            if (isMapMode) {
                mapContainer.classList.add('visible');
                listContainer.style.display = 'none';
                btn.classList.add('active');
                btn.innerHTML = '📋'; // Switch icon to List
                if(!map) initMap();
            } else {
                mapContainer.classList.remove('visible');
                listContainer.style.display = 'block';
                btn.classList.remove('active');
                btn.innerHTML = '🗺️';
            }
        }

        function filter(cat) {
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.innerText.includes(cat) || (cat === 'all' && btn.innerText === '全部')) {
                    btn.classList.add('active');
                }
            });

            // Filter List
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const cCat = card.getAttribute('data-cat');
                if (cat === 'all') {
                    card.style.display = 'block';
                } else {
                    // Match simplified category
                    if (cCat.includes(cat) || 
                       (cat === '購物' && (cCat.includes('服飾') || cCat.includes('選物'))) ||
                       (cat === '咖啡甜點' && cCat.includes('咖啡'))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            // Filter Map (if initialized)
            if (map) {
                markers.forEach(m => {
                    const cCat = m.data.category;
                    let visible = false;
                    if (cat === 'all') visible = true;
                    else if (cCat.includes(cat) || 
                       (cat === '購物' && (cCat.includes('服飾') || cCat.includes('選物'))) ||
                       (cat === '咖啡甜點' && cCat.includes('咖啡'))) visible = true;
                    
                    if (visible) m.marker.addTo(map);
                    else m.marker.remove();
                });
            }
        }
    </script>
</body>
</html>`;

fs.writeFileSync(outFile, html);
console.log("Generated " + outFile);

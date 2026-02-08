# MEMORY.md - Long-term Memory

## About Tina
- Named me 龍蝦 (Lobster) 🦞
- Uses iPhone, 中華電信
- Prefers Traditional Chinese (繁體中文)
- Works as PM/Designer, uses Figma
- Telegram ID: 6852272820

## Major Projects

### Seoul Trip Dashboard (Feb 2026)
Built a comprehensive travel app (HTML) for Tina's Korea trip:
- 50+ locations with Chinese/Korean dual names
- Google Maps + Naver Map dual links
- Must-eat/must-buy recommendations
- Mobile-responsive with category tabs
- Map view with all markers
- **Key insight**: Naver Map requires Korean text for accurate search

### Tarot App (Feb 2026)
- Updated to "Cosmic Tarot" dark theme
- Glassmorphism UI
- AI chat-style interpretation

### Risk Settings UI (Feb 2026)
- Optimized 風險設置 form for Figma
- Provided Chinese functional spec
- Created interactive HTML prototype

## Technical Notes
- Windows PowerShell doesn't support `&&` for command chaining
- Telegram channel needs `dmPolicy: "allowlist"` with user IDs
- Naver Map Korean names are essential for accurate location search
- Mobile HTML apps need synchronous JS rendering (avoid waiting for external scripts)

## Lessons Learned
- When building HTML for mobile, test JS execution order carefully
- Leaflet maps need `invalidateSize()` when shown from hidden state
- Always provide Chinese names alongside Korean for user reference

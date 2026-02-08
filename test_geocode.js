const https = require('https');

const address = "서울 중구 을지로 110"; // Cheongwaok
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

const options = {
  headers: {
    'User-Agent': 'OpenClaw-Agent-Test/1.0' 
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.error("Error: " + err.message);
});

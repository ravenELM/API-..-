const express = require('express');
const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// No API key required

// Import API handlers directl
const cards = require('./api/cards.js');
const randomcard = require('./api/randomcard.js');
const cardtier = require('./api/cardtier.js');
const cardid = require('./api/cardid.js');
const enhance = require('./api/enhance.js');
const chatgpt = require('./api/chatgpt.js');
const copilot = require('./api/copilot.js');
const cohere = require('./api/cohere.js');
const tiktok = require('./api/tiktok.js');
const igdl = require('./api/igdl.js');
const musicapple = require('./api/musicapple.js');
const facebook = require('./api/facebook.js');
const spotify = require('./api/spotify.js');
const twitter = require('./api/twitter.js');
const youtube = require('./api/youtube.js');

// Wrap each handler into Express endpoints
app.all('/cards', cards);
app.all('/randomcard', randomcard);
app.all('/cardtier', cardtier);
app.all('/cardid', cardid);
app.get('/enhance', enhance);
app.get('/chatgpt', chatgpt);
app.get('/copilot', copilot);
app.get('/cohere', cohere);
app.get('/tiktok', tiktok);
app.get('/igdl', igdl);
app.get('/musicapple', musicapple);
app.get('/facebook', facebook);
app.get('/spotify', spotify);
app.get('/twitter', twitter);
app.get('/youtube', youtube);

// Default route
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
<title>Apfel API</title>
<style>
body { font-family: Arial, sans-serif; background: #f0f0f0; text-align: center; padding: 20px; }
h1 { color: #333; }
h2 { color: #555; }
ul { list-style: none; padding: 0; }
li { background: white; margin: 10px auto; padding: 15px; border-radius: 5px; max-width: 600px; display: flex; justify-content: space-between; align-items: center; }
.tutorial { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px auto; max-width: 600px; text-align: left; }
button { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
button:hover { background: #0056b3; }
</style>
</head>
<body>
<h1>APFEL API IS LIVE 🚀</h1>
<h2>MADE BY RAVEN</h2>

<h2>Endpoints:</h2>
<ul>
<li><strong>/cards</strong> - Cards API <button onclick="window.location.href='https://api-hlgg.onrender.com//cards'">Try</button></li>
<li><strong>/randomcard</strong> - Random Card <button onclick="window.location.href='https://api-hlgg.onrender.com//randomcard'">Try</button></li>
<li><strong>/cardtier</strong> - Card Tier <button onclick="window.location.href='https://api-hlgg.onrender.com//cardtier?tier=S'">Try</button></li>
<li><strong>/cardid</strong> - Card ID <button onclick="window.location.href='https://api-hlgg.onrender.com//cardid?id=64cf72751736ec1ad5e87f1c'">Try</button></li>
<li><strong>/enhance</strong> - Image Enhancement <button onclick="window.location.href='https://api-hlgg.onrender.com//enhance?url=https://example.com/image.jpg'">Try</button></li>
<li><strong>/chatgpt</strong> - ChatGPT API <button onclick="window.location.href='https://api-hlgg.onrender.com//chatgpt?q=hello'">Try</button></li>
<li><strong>/copilot</strong> - Copilot API <button onclick="window.location.href='https://api-hlgg.onrender.com//copilot?text=hello'">Try</button></li>
<li><strong>/cohere</strong> - Cohere API <button onclick="window.location.href='https://api-hlgg.onrender.com//cohere?q=hello'">Try</button></li>
<li><strong>/tiktok</strong> - TikTok Downloader <button onclick="window.location.href='https://api-hlgg.onrender.com//tiktok?url=https://tiktok.com/@user/video/123'">Try</button></li>
<li><strong>/igdl</strong> - Instagram DL <button onclick="window.location.href='https://api-hlgg.onrender.com//igdl?url=https://instagram.com/p/123'">Try</button></li>
<li><strong>/musicapple</strong> - Apple Music <button onclick="window.location.href='https://api-hlgg.onrender.com//musicapple?url=https://music.apple.com/us/album/example'">Try</button></li>
<li><strong>/facebook</strong> - Facebook Downloader <button onclick="window.location.href='https://api-hlgg.onrender.com//facebook?url=https://facebook.com/post/123'">Try</button></li>
<li><strong>/spotify</strong> - Spotify API <button onclick="window.location.href='https://api-hlgg.onrender.com//spotify?url=https://open.spotify.com/track/123'">Try</button></li>
<li><strong>/twitter</strong> - Twitter Downloader <button onclick="window.location.href='https://api-hlgg.onrender.com//twitter?url=https://twitter.com/user/status/123'">Try</button></li>
<li><strong>/youtube</strong> - YouTube Downloader <button onclick="window.location.href='https://api-hlgg.onrender.com//youtube?q=tamako'">Try</button></li>
</ul>
</body>
</html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

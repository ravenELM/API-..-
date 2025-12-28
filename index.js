const express = require('express');
const fs = require('fs');
const path = require('path');
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

// Wrap each handler into Express endpoints
app.all('/cards', cards);
app.all('/randomcard', randomcard);
app.all('/cardtier', cardtier);
app.all('/cardid', cardid);

// Import scraper
const { scrapeCards } = require('./scraper');

// Define events
const events = [
    { route: 'winter-cards', file: 'winter_cards.json' },
    { route: 'summer-cards', file: 'summer_cards.json' },
    { route: 'halloween-cards', file: 'halloween_cards.json' },
    { route: 'chinese-new-year-cards', file: 'chinese_new_year_cards.json' },
    { route: 'valentines-day-cards', file: 'valentines_day_cards.json' },
    { route: 'easter-cards', file: 'easter_cards.json' },
    { route: 'my-hero-academia-ccg-cards', file: 'my_hero_academia_ccg_cards.json' },
    { route: 'maid-day-cards', file: 'maid_day_cards.json' },
    { route: 'gala-cards', file: 'gala_cards.json' },
    { route: 'sworn-cards', file: 'sworn_cards.json' }
];

// Function to create router for an event
const createEventRouter = (fileName) => {
    const router = express.Router();
    const filePath = path.join(__dirname, 'cards', fileName);

    router.all('/cards', async (req, res) => {
        try {
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cards' });
        }
    });

    router.all('/randomcard', async (req, res) => {
        try {
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data.length === 0) return res.status(404).json({ error: 'No cards available' });
            const randomCard = data[Math.floor(Math.random() * data.length)];
            res.json(randomCard);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch random card' });
        }
    });

    router.all('/cardtier', async (req, res) => {
        try {
            let { tier } = req.query;
            if (!tier) return res.status(400).json({ error: 'Please provide a tier, e.g. ?tier=S' });
            tier = tier.toUpperCase();
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const filtered = data.filter(card => card.tier === tier);
            res.json(filtered);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cards by tier' });
        }
    });

    router.all('/cardid', async (req, res) => {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: 'Please provide a card ID, e.g. ?id=...' });
            if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Cards not found' });
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const card = data.find(c => c.id === id);
            if (!card) return res.status(404).json({ error: 'Card not found' });
            res.json(card);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch card by ID' });
        }
    });

    return router;
};

// Add routes for each event
events.forEach(event => {
    app.use(`/${event.route}`, createEventRouter(event.file));
});

// Default route
app.get('/', (req, res) => {
  const baseUrl = 'https://api-hlgg.onrender.com';
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
<li><strong>/cards</strong> - Cards API <button onclick="window.location.href='${baseUrl}/cards'">Try</button></li>
<li><strong>/randomcard</strong> - Random Card <button onclick="window.location.href='${baseUrl}/randomcard'">Try</button></li>
<li><strong>/cardtier</strong> - Card Tier <button onclick="window.location.href='${baseUrl}/cardtier?tier=S'">Try</button></li>
<li><strong>/cardid</strong> - Card ID <button onclick="window.location.href='${baseUrl}/cardid?id=64cf72751736ec1ad5e87f1c'">Try</button></li>
</ul>

<h2>Event Categories:</h2>
<ul>
<li><strong>/winter-cards/cards</strong> - Winter Cards <button onclick="window.location.href='${baseUrl}/winter-cards/cards'">Try</button></li>
<li><strong>/winter-cards/randomcard</strong> - Winter Random Card <button onclick="window.location.href='${baseUrl}/winter-cards/randomcard'">Try</button></li>
<li><strong>/winter-cards/cardtier</strong> - Winter Card Tier <button onclick="window.location.href='${baseUrl}/winter-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/winter-cards/cardid</strong> - Winter Card ID <button onclick="window.location.href='${baseUrl}/winter-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/summer-cards/cards</strong> - Summer Cards <button onclick="window.location.href='${baseUrl}/summer-cards/cards'">Try</button></li>
<li><strong>/summer-cards/randomcard</strong> - Summer Random Card <button onclick="window.location.href='${baseUrl}/summer-cards/randomcard'">Try</button></li>
<li><strong>/summer-cards/cardtier</strong> - Summer Card Tier <button onclick="window.location.href='${baseUrl}/summer-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/summer-cards/cardid</strong> - Summer Card ID <button onclick="window.location.href='${baseUrl}/summer-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/halloween-cards/cards</strong> - Halloween Cards <button onclick="window.location.href='${baseUrl}/halloween-cards/cards'">Try</button></li>
<li><strong>/halloween-cards/randomcard</strong> - Halloween Random Card <button onclick="window.location.href='${baseUrl}/halloween-cards/randomcard'">Try</button></li>
<li><strong>/halloween-cards/cardtier</strong> - Halloween Card Tier <button onclick="window.location.href='${baseUrl}/halloween-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/halloween-cards/cardid</strong> - Halloween Card ID <button onclick="window.location.href='${baseUrl}/halloween-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/chinese-new-year-cards/cards</strong> - Chinese New Year Cards <button onclick="window.location.href='${baseUrl}/chinese-new-year-cards/cards'">Try</button></li>
<li><strong>/chinese-new-year-cards/randomcard</strong> - Chinese New Year Random Card <button onclick="window.location.href='${baseUrl}/chinese-new-year-cards/randomcard'">Try</button></li>
<li><strong>/chinese-new-year-cards/cardtier</strong> - Chinese New Year Card Tier <button onclick="window.location.href='${baseUrl}/chinese-new-year-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/chinese-new-year-cards/cardid</strong> - Chinese New Year Card ID <button onclick="window.location.href='${baseUrl}/chinese-new-year-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/valentines-day-cards/cards</strong> - Valentines Day Cards <button onclick="window.location.href='${baseUrl}/valentines-day-cards/cards'">Try</button></li>
<li><strong>/valentines-day-cards/randomcard</strong> - Valentines Day Random Card <button onclick="window.location.href='${baseUrl}/valentines-day-cards/randomcard'">Try</button></li>
<li><strong>/valentines-day-cards/cardtier</strong> - Valentines Day Card Tier <button onclick="window.location.href='${baseUrl}/valentines-day-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/valentines-day-cards/cardid</strong> - Valentines Day Card ID <button onclick="window.location.href='${baseUrl}/valentines-day-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/easter-cards/cards</strong> - Easter Cards <button onclick="window.location.href='${baseUrl}/easter-cards/cards'">Try</button></li>
<li><strong>/easter-cards/randomcard</strong> - Easter Random Card <button onclick="window.location.href='${baseUrl}/easter-cards/randomcard'">Try</button></li>
<li><strong>/easter-cards/cardtier</strong> - Easter Card Tier <button onclick="window.location.href='${baseUrl}/easter-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/easter-cards/cardid</strong> - Easter Card ID <button onclick="window.location.href='${baseUrl}/easter-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/my-hero-academia-ccg-cards/cards</strong> - My Hero Academia CCG Cards <button onclick="window.location.href='${baseUrl}/my-hero-academia-ccg-cards/cards'">Try</button></li>
<li><strong>/my-hero-academia-ccg-cards/randomcard</strong> - My Hero Academia CCG Random Card <button onclick="window.location.href='${baseUrl}/my-hero-academia-ccg-cards/randomcard'">Try</button></li>
<li><strong>/my-hero-academia-ccg-cards/cardtier</strong> - My Hero Academia CCG Card Tier <button onclick="window.location.href='${baseUrl}/my-hero-academia-ccg-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/my-hero-academia-ccg-cards/cardid</strong> - My Hero Academia CCG Card ID <button onclick="window.location.href='${baseUrl}/my-hero-academia-ccg-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/maid-day-cards/cards</strong> - Maid Day Cards <button onclick="window.location.href='${baseUrl}/maid-day-cards/cards'">Try</button></li>
<li><strong>/maid-day-cards/randomcard</strong> - Maid Day Random Card <button onclick="window.location.href='${baseUrl}/maid-day-cards/randomcard'">Try</button></li>
<li><strong>/maid-day-cards/cardtier</strong> - Maid Day Card Tier <button onclick="window.location.href='${baseUrl}/maid-day-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/maid-day-cards/cardid</strong> - Maid Day Card ID <button onclick="window.location.href='${baseUrl}/maid-day-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/gala-cards/cards</strong> - Gala Cards <button onclick="window.location.href='${baseUrl}/gala-cards/cards'">Try</button></li>
<li><strong>/gala-cards/randomcard</strong> - Gala Random Card <button onclick="window.location.href='${baseUrl}/gala-cards/randomcard'">Try</button></li>
<li><strong>/gala-cards/cardtier</strong> - Gala Card Tier <button onclick="window.location.href='${baseUrl}/gala-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/gala-cards/cardid</strong> - Gala Card ID <button onclick="window.location.href='${baseUrl}/gala-cards/cardid?id=example'">Try</button></li>
</ul>
<ul>
<li><strong>/sworn-cards/cards</strong> - Sworn Cards <button onclick="window.location.href='${baseUrl}/sworn-cards/cards'">Try</button></li>
<li><strong>/sworn-cards/randomcard</strong> - Sworn Random Card <button onclick="window.location.href='${baseUrl}/sworn-cards/randomcard'">Try</button></li>
<li><strong>/sworn-cards/cardtier</strong> - Sworn Card Tier <button onclick="window.location.href='${baseUrl}/sworn-cards/cardtier?tier=S'">Try</button></li>
<li><strong>/sworn-cards/cardid</strong> - Sworn Card ID <button onclick="window.location.href='${baseUrl}/sworn-cards/cardid?id=example'">Try</button></li>
</ul>
</body>
</html>
  `;
  res.send(html);
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Starting scraper...');
  await scrapeCards();
  console.log('Scraping complete. API ready.');
});

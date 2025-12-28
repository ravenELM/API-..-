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
<li><strong>/cards</strong> - Cards API <button onclick="window.location.href='https://api-hlgg.onrender.com/cards'">Try</button></li>
<li><strong>/randomcard</strong> - Random Card <button onclick="window.location.href='https://api-hlgg.onrender.com/randomcard'">Try</button></li>
<li><strong>/cardtier</strong> - Card Tier <button onclick="window.location.href='https://api-hlgg.onrender.com/cardtier?tier=S'">Try</button></li>
<li><strong>/cardid</strong> - Card ID <button onclick="window.location.href='https://api-hlgg.onrender.com/cardid?id=64cf72751736ec1ad5e87f1c'">Try</button></li>
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

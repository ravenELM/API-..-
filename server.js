const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Session setup
app.use(session({
  secret: 'your-secret-key', // Change to a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Rate limiter: 40 requests per hour per API key
// const rateLimiter = new RateLimiterMemory({
//   keyPrefix: 'api',
//   points: 40, // Number of requests
//   duration: 60 * 60, // Per hour
// });

// Middleware to check API key for API routes
const requireApiKey = async (req, res, next) => {
  const apiKey = req.query.api_key;
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
  const user = users.find(u => u.apiKey === apiKey);
  if (!user) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Rate limiting
  // try {
  //   await rateLimiter.consume(apiKey);
  //   req.user = user;
  //   next();
  // } catch (rejRes) {
  //   res.status(429).json({ error: 'Too many requests. Limit: 40 per hour' });
  // }
  req.user = user;
  next();
};

// Auth routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const apiKey = crypto.randomBytes(32).toString('hex');
  const newUser = { email, password: hashedPassword, apiKey };
  users.push(newUser);
  fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
  res.json({ message: 'User registered', apiKey });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = user;
  res.json({ message: 'Logged in', apiKey: user.apiKey });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  res.json({ email: req.session.user.email, apiKey: req.session.user.apiKey });
});

// Import API handlers directly
const cards = require('./api/cards.js');
const randomcard = require('./api/randomcard.js');
const cardtier = require('./api/cardtier.js');
const cardid = require('./api/cardid.js');
const chatgpt = require('./api/chatgpt.js');
const cohere = require('./api/cohere.js');
const copilot = require('./api/copilot.js');
const enhance = require('./api/enhance.js');
const facebook = require('./api/facebook.js');
const igdl = require('./api/igdl.js');
const imagen3 = require('./api/imagen3.js');
const musicapple = require('./api/musicapple.js');
const nsfw = require('./api/nsfw.js');
const spotify = require('./api/spotify.js');
const tiktok = require('./api/tiktok.js');
const twitter = require('./api/twitter.js');
const youtube = require('./api/youtube.js');

// Wrap each handler into Express endpoints with API key check
app.all('/cards', requireApiKey, cards);
app.all('/randomcard', requireApiKey, randomcard);
app.all('/cardtier', requireApiKey, cardtier);
app.all('/cardid', requireApiKey, cardid);
app.all('/chatgpt', requireApiKey, chatgpt);
app.all('/cohere', requireApiKey, cohere);
app.all('/copilot', requireApiKey, copilot);
app.all('/enhance', requireApiKey, enhance);
app.all('/facebook', requireApiKey, facebook);
app.all('/igdl', requireApiKey, igdl);
app.all('/imagen3', requireApiKey, imagen3);
app.all('/musicapple', requireApiKey, musicapple);
app.all('/nsfw', requireApiKey, nsfw);
app.all('/spotify', requireApiKey, spotify);
app.all('/tiktok', requireApiKey, tiktok);
app.all('/twitter', requireApiKey, twitter);
app.all('/youtube', requireApiKey, youtube);

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

// Add routes for each event with API key
events.forEach(event => {
    app.use(`/${event.route}`, requireApiKey, createEventRouter(event.file));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
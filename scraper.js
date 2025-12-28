const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const scrapeEvent = async (eventName, urlBase, outputFile, maxPages) => {
    console.log(`Starting scraping for ${eventName}`);

    // Load cardas data from local JSON
    const cardas = JSON.parse(fs.readFileSync(path.join(__dirname, 'cardas.json'), 'utf8'));

    // Create a map from title to source
    const titleToSource = {};
    cardas.forEach(card => {
      titleToSource[card.title] = card.source;
    });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Load existing cards data
    let cardsData = [];
    const filePath = path.join(__dirname, 'cards', outputFile);
    if (fs.existsSync(filePath)) {
        try {
            cardsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(`Loaded ${cardsData.length} existing ${eventName} cards.`);
        } catch (error) {
            console.error(`Error loading existing JSON for ${eventName}:`, error.message);
        }
    }

    // Set of existing card IDs
    const existingIds = new Set(cardsData.map(card => card.id));

    // Loop over pages
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const url = `${urlBase}?page=${pageNum}&tier=null`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for cards to load
        try {
            await page.waitForSelector('.text-center.cards-list', { timeout: 10000 });
        } catch (e) {
            console.log(`No cards list found on ${url} for ${eventName}`);
            break;  // If no cards load, stop
        }

        // Find all card elements
        const cardElements = await page.$$('.text-center.cards-list .card-main .card');
        console.log(`[${eventName}] Found ${cardElements.length} cards on ${url}`);

        if (cardElements.length === 0) {
            break;  // No more cards on this page
        }

        for (const card of cardElements) {
            const media = await card.$('.cardContent .cardData img, .cardContent .cardData video');
            if (!media) continue;
            const src = await media.evaluate(el => el.getAttribute('src'));
            const name = await media.evaluate(el => el.getAttribute('title') || el.getAttribute('alt'));
            const link = await card.evaluate(el => el.parentElement?.getAttribute('href') || el.getAttribute('href') || el.querySelector('a')?.getAttribute('href'));
            if (!link) continue;
            const id = link.split('/').pop();
            if (name && id && !existingIds.has(id)) {
                const serie = titleToSource[name];
                if (!serie) continue;
                const tierNum = parseInt(src.split('/')[5]);
                const cardData = {
                    id: id,
                    tier: tierNum.toString(),
                    title: name,
                    source: serie,
                    image: src
                };
                cardsData.push(cardData);
                existingIds.add(id);
                console.log(`[${eventName}] Added card: ${name} (${id})`);
            }
        }

        // Save after each page
        console.log(`[${eventName}] Page ${pageNum} done. Collected ${cardsData.length} cards so far. Saving...`);
        try {
            // Ensure 'cards' directory exists
            const dirPath = path.join(__dirname, 'cards');
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                console.log(`Directory "cards" created for ${eventName}.`);
            }

            // Save to JSON file
            fs.writeFileSync(filePath, JSON.stringify(cardsData, null, 2));
            console.log(`[${eventName}] Data saved to ${filePath}`);
        } catch (error) {
            console.error(`Error saving JSON for ${eventName}:`, error.message);
        }

        await new Promise(resolve => setTimeout(resolve, 500));  // Faster delay
    }

    // Close the browser
    await page.close();
    await browser.close();

    console.log(`${eventName} scraping complete.`);
};

const scrapeCards = async () => {
    await Promise.all([
        scrapeEvent('Winter Cards', 'https://shoob.gg/card-events/christmas', 'winter_cards.json', 83),
        scrapeEvent('Summer Cards', 'https://shoob.gg/card-events/summer', 'summer_cards.json', 99),
        scrapeEvent('Halloween Cards', 'https://shoob.gg/card-events/halloween', 'halloween_cards.json', 77),
        scrapeEvent('Chinese New Year Cards', 'https://shoob.gg/card-events/chinese-new-year', 'chinese_new_year_cards.json', 39),
        scrapeEvent('Valentines Day Cards', 'https://shoob.gg/card-events/valentines-day', 'valentines_day_cards.json', 48),
        scrapeEvent('Easter Cards', 'https://shoob.gg/card-events/easter', 'easter_cards.json', 10),
        scrapeEvent('My Hero Academia CCG Cards', 'https://shoob.gg/card-events/my-hero-academia-ccg', 'my_hero_academia_ccg_cards.json', 1),
        scrapeEvent('Maid Day Cards', 'https://shoob.gg/card-events/maid-day', 'maid_day_cards.json', 16),
        scrapeEvent('Gala Cards', 'https://shoob.gg/card-events/gala', 'gala_cards.json', 25),
        scrapeEvent('Sworn Cards', 'https://shoob.gg/card-events/sworn', 'sworn_cards.json', 1)
    ]);
    console.log("All scraping complete.");
};

module.exports = { scrapeCards };

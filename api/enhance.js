// File: api/enhance.js

module.exports = async (req, res) => {
    const imageUrl = req.query.url;

    if (!imageUrl) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    try {
        // Call external API
        const response = await fetch(`https://api-rebix.vercel.app/api/enhance?url=${encodeURIComponent(imageUrl)}`);

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        // Forward the image directly
        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

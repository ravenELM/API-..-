
module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "Missing 'url' query parameter" });

    try {
        // External API call to your TikTok downloader
        const apiUrl = `https://api-rebix.vercel.app/api/tiktok?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`External API error: ${response.status}`);

        const data = await response.json();

        // Change creator to Raven if needed
        if (data.creator === "Samuel-Rebix") data.creator = "Raven";

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

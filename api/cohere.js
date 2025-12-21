
module.exports = async (req, res) => {
    const { q } = req.query;

    if (!q) return res.status(400).json({ error: "Missing 'q' query parameter" });

    try {
        // External API call
        const apiUrl = `https://api-rebix.vercel.app/api/cohere?q=${encodeURIComponent(q)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`External API error: ${response.status}`);

        const data = await response.json();

        // Replace creator with Raven
        if (data.creator === "Samuel-Rebix") data.creator = "Raven";

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

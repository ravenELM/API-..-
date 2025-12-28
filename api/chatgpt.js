module.exports = async (req, res) => {
    const { q, prompt } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Missing 'q' query parameter" });
    }

    try {
        // Call external GPT logic API
        const apiUrl = `https://api-rebix.vercel.app/api/gptlogic?q=${encodeURIComponent(q)}&prompt=${encodeURIComponent(prompt || '')}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        const data = await response.json();

        // Change creator from Samuel-Rebix to Raven
        if (data.creator === "Samuel-Rebix") {
            data.creator = "Raven";
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

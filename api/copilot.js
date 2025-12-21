
module.exports = async (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' query parameter" });
    }

    try {
        // Call the external Copilot API
        const apiUrl = `https://api-rebix.vercel.app/api/copilot?text=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        const data = await response.json();

        // Replace creator name with Raven
        if (data.creator === "Samuel-Rebix") {
            data.creator = "Raven";
        }

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

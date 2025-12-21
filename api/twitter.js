
module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, error: "Missing 'url' query parameter" });
    }

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`External API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: err.message });
    }
};

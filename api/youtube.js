
module.exports = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Please provide a search query, e.g. ?q=tamako' });
    }

    // Call the Rebix YTPlay API
    const apiUrl = `https://api-rebix.vercel.app/api/ytplay?q=${encodeURIComponent(q)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Remove the 'creator' field
    const { creator, ...resultWithoutCreator } = data;

    // Return the modified data
    res.json({
      status: data.status,
      result: resultWithoutCreator.result || data.result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch YouTube video' });
  }
};

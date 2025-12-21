
module.exports = async (req, res) => {
  try {
    let { tier } = req.query;

    if (!tier) {
      return res.status(400).json({ error: 'Please provide a tier, e.g. ?tier=S' });
    }

    // Force tier to uppercase
    tier = tier.toUpperCase();

    const response = await fetch(`https://aurora-api-ten.vercel.app/card/tier?tier=${tier}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cards by tier' });
  }
};

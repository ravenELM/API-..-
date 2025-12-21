
module.exports = async (req, res) => {
  try {
    const response = await fetch('https://aurora-api-ten.vercel.app/cards');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

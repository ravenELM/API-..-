
module.exports = async (req, res) => {
  try {
    const response = await fetch('https://aurora-api-ten.vercel.app/card/random');
    const card = await response.json();
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch random card' });
  }
};


module.exports = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Please provide a card ID, e.g. ?id=64cf72751736ec1ad5e87f1c' });
    }

    // Fetch all cards from Aurora API
    const response = await fetch('https://aurora-api-ten.vercel.app/cards');
    const data = await response.json();

    // Find the card by ID
    const card = data.find(c => c.id === id);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch card by ID' });
  }
};

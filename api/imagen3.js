
module.exports = async (req, res) => {
  const { text, ratio } = req.query;

  if (!text || !ratio) {
    return res.status(400).json({
      status: false,
      error: "Missing required parameters: 'text' and 'ratio'"
    });
  }

  try {
    // Step 1: Start the image generation
    const startUrl = `https://api.paxsenix.org/ai-image/imagen3?text=${encodeURIComponent(text)}&ratio=${encodeURIComponent(ratio)}`;
    const startResponse = await fetch(startUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-paxsenix-NUGSlCJLrYzSqQbtGLHzcafW2aknQNs01Lqyf-uAbRVwj6o7'
      }
    });

    if (!startResponse.ok) throw new Error(`Failed to start job: ${startResponse.status}`);

    const startData = await startResponse.json();

    if (!startData.task_url) {
      return res.status(500).json({
        status: false,
        error: "Missing task URL from API response"
      });
    }

    const taskUrl = startData.task_url;

    // Step 2: Poll the task URL until image generation is complete
    let result;
    for (let i = 0; i < 10; i++) { // up to 10 retries
      const taskResponse = await fetch(taskUrl, {
        headers: { 'Authorization': 'Bearer sk-paxsenix-NUGSlCJLrYzSqQbtGLHzcafW2aknQNs01Lqyf-uAbRVwj6o7' }
      });

      if (!taskResponse.ok) throw new Error(`Failed to fetch task: ${taskResponse.status}`);

      const taskData = await taskResponse.json();

      if (taskData.status === 'done' && taskData.url) {
        result = taskData;
        break;
      }

      // Wait before retrying (1 second)
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!result) {
      return res.status(202).json({
        status: true,
        message: "Image generation still in progress. Try again later.",
        task_url: taskUrl
      });
    }

    // Step 3: Return the final image URL
    res.json({
      status: true,
      creator: 'Raven',
      text,
      ratio,
      image_url: result.url
    });

  } catch (err) {
    console.error('❌ Imagen-3 error:', err);
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

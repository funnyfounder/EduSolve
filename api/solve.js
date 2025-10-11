// api/solve.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { inputs } = req.body;
  if (!inputs) {
    return res.status(400).json({ error: 'Missing inputs field' });
  }

  try {
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/UserLM-8b',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs })
      }
    );

    if (!hfRes.ok) {
      const error = await hfRes.text();
      return res.status(hfRes.status).send(error);
    }

    const text = await hfRes.text();
    res.status(200).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Inference error' });
  }
}

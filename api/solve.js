// api/solve.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { inputs, subject, difficulty } = req.body;
  
  if (!inputs) {
    return res.status(400).json({ error: 'Missing inputs field' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    // Create a detailed prompt for better educational responses
    const enhancedPrompt = `
You are an expert ${subject || 'academic'} tutor. 

Question: ${inputs}
Difficulty Level: ${difficulty || 'Medium'}

Please provide:
1. A clear, concise final answer
2. Step-by-step explanation showing your work
3. Key concepts used

Format your response clearly with the answer first, then detailed steps.
`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(response.status).json({ 
        error: 'Gemini API request failed', 
        details: error 
      });
    }

    const data = await response.json();
    
    // Extract the clean text from the nested response structure
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return res.status(500).json({ 
        error: 'No response generated',
        rawResponse: data 
      });
    }

    // Return clean, formatted response
    res.status(200).json({ 
      answer: generatedText,
      metadata: {
        model: data.modelVersion || 'gemini-2.5-flash-lite',
        tokensUsed: data.usageMetadata?.totalTokenCount || 0,
        finishReason: data.candidates?.[0]?.finishReason || 'STOP'
      }
    });
    
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Inference error', 
      message: err.message 
    });
  }
}

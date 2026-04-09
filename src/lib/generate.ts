const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = https://openrouter.ai/api/v1/chat/completions;

export async function generateJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  if (!OPENROUTER_API_KEY) {
    throw new Error(OPENROUTER_API_KEY not configured);
  }

  const res = await fetch(OPENROUTER_URL, {
    method: POST,
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      Content-Type: application/json,
    },
    body: JSON.stringify({
      model: qwen/qwen3-235b-a22b,
      messages: [
        { role: system, content: systemPrompt },
        { role: user, content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${error}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? ;

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\s*/g, ).replace(/```\s*/g, ).trim();
  return JSON.parse(cleaned) as T;
}

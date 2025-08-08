export async function callOpenRouterViaBackend({
  prompt,
  model,
  messages
}: {
  prompt?: string,
  model: string,
  messages?: { role: string, content: string }[]
}) {
  const response = await fetch('http://localhost:5000/api/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model, messages }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'OpenRouter backend error');
  }
  const data = await response.json();
  return data.result;
}
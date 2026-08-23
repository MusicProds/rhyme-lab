// 1. Worker Proxy URL
const PROXY_URL = 'https://rapid-bar-6445.yghostboyo-222.workers.dev';
const MODEL_NAME = 'llama-3.3-70b-versatile';

// 2. Initialization of Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

// 3. Basic function for accessing AI via Proxy
async function callGroqApi(systemPrompt, userPrompt) {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 4. Logic of the Idea generator
document.getElementById('generateIdeaBtn').addEventListener('click', async () => {
  const bpm = document.getElementById('bpmInput').value || 'Random';
  const mood = document.getElementById('moodSelect').value;
  const keywords = document.getElementById('keywordsInput').value || 'нет';
  const output = document.getElementById('ideaOutput');

  output.classList.remove('hidden');
  output.textContent = '⏳ Generating concept...';

  const systemPrompt = `You are a rap producer and ghostwriter. Your task is to come up with an eye-catching track concept. Output the result strictly in the format:
🎵 TRACK TITLE: [Title]
💡 5 STARTING POINTS:
1. [Line 1]
2. [Line 2]
3. [Line 3]
4. [Line 4]
5. [Line 5]`;

  const userPrompt = `BPM: ${bpm}, Mood: ${mood}, Keywords: ${keywords}`;

  try {
    const result = await callGroqApi(systemPrompt, userPrompt);
    output.textContent = result;
  } catch (err) {
    output.textContent = `❌ Ошибка: ${err.message}`;
  }
});

// 5. Logic of the Rhyme generator
document.getElementById('findRhymesBtn').addEventListener('click', async () => {
  const word = document.getElementById('wordInput').value;
  const output = document.getElementById('rhymesOutput');

  if (!word) {
    alert('Введите слово для поиска рифм');
    return;
  }

  output.classList.remove('hidden');
  output.textContent = '⏳ Searching rhymes...';

  const systemPrompt = `You are a rhyming dictionary for hip-hop artists. Provide a list of rich, creative rhymes for the given word in Russian or English (match the input language). Group them by type (exact, slant, multi-syllable). Keep explanations minimal.`;
  const userPrompt = `Find rhymes for the word: "${word}"`;

  try {
    const result = await callGroqApi(systemPrompt, userPrompt);
    output.textContent = result;
  } catch (err) {
    output.textContent = `❌ Ошибка: ${err.message}`;
  }
});

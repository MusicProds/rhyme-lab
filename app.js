// 1. Настройки API Groq
// Вставь свой ключ вместо 'ВСТАВЬ_СЮДА_СВОЙ_КЛЮЧ_GROQ'
const GROQ_API_KEY = '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'; 
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';

// 2. Инициализация Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

// 3. Базовая функция обращения к AI
async function callGroqAPI(systemPrompt, userPrompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
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
    throw new Error(`Ошибка API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 4. Логика Генератора Идей
document.getElementById('generateIdeaBtn').addEventListener('click', async () => {
  const bpm = document.getElementById('bpmInput').value || 'Random';
  const mood = document.getElementById('moodSelect').value;
  const keywords = document.getElementById('keywordsInput').value || 'нет';
  const output = document.getElementById('ideaOutput');

  output.classList.remove('hidden');
  output.textContent = '⏳ Генерирую концепт...';

  const systemPrompt = `Ты — рэп-продюсер и гострайтер. Твоя задача — придумать цепляющий концепт трека.
Выдай результат строго в формате:
🔥 НАЗВАНИЕ ТРЕКА: [Название]
💡 5 СТАРТОВЫХ ЗАЦЕПОК:
1. [Строчка 1]
2. [Строчка 2]
3. [Строчка 3]
4. [Строчка 4]
5. [Строчка 5]`;

  const userPrompt = `BPM: ${bpm}, Настроение: ${mood}, Ключевые слова: ${keywords}.`;

  try {
    const result = await callGroqAPI(systemPrompt, userPrompt);
    output.textContent = result;
  } catch (error) {
    output.textContent = '❌ Ошибка при генерации. Проверь API-ключ.';
    console.error(error);
  }
});

// 5. Логика Неквадратных Рифм
document.getElementById('findRhymesBtn').addEventListener('click', async () => {
  const word = document.getElementById('wordInput').value.trim();
  const output = document.getElementById('rhymesOutput');

  if (!word) {
    alert('Введи слово для поиска рифм!');
    return;
  }

  output.classList.remove('hidden');
  output.textContent = '⏳ Ищу созвучия и ассонансы...';

  const systemPrompt = `Ты — хип-хоп лирик. Твоя задача — подобрать НЕКВАДРАТНЫЕ, сложные и свежие рифмы к слову.
ИЗБЕГАЙ банальных точных рифм (например: ночь -> дочь/прочь).
Используй ассонансы, созвучия по ударным гласным, сдвиги ударений и сложные фонетические комбинации.

Разбей ответ на категории:
✨ Ассонансы и созвучия (словосочетания или фразы)
🎯 Грамматические смещения / Неквадратные слова
🔥 Двойные / Сложные рифмы`;

  const userPrompt = `Подбери неквадратные рифмы к слову: "${word}"`;

  try {
    const result = await callGroqAPI(systemPrompt, userPrompt);
    output.textContent = result;
  } catch (error) {
    output.textContent = '❌ Ошибка при поиске рифм. Проверь API-ключ.';
    console.error(error);
  }
});

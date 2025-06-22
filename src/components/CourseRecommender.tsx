// src/components/CourseRecommender.tsx
import { useState } from 'react';
import { getNFTs } from '@/lib/LocalStorageUtil';

const API_URL = import.meta.env.VITE_GROQ_API_URL;
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function CourseRecommender() {
const [input, setInput] = useState('');
const [chatLog, setChatLog] = useState<string[]>([]);
const [loading, setLoading] = useState(false);

const existingBadges = getNFTs()
  .map((nft) => `- ${nft.name}: ${nft.description}`)
  .join('\n');

const sendQuery = async () => {
if (!input.trim()) return;
setLoading(true);
setChatLog((prev) => [...prev, `🧑 You: ${input}`]);
const messages = [
  {
    role: 'system',
    content: `You are an AI course advisor. The user has the following achievement badges:\n${existingBadges}\n\nYour job is to recommend future courses the user should take based on their past achievements.`,
  },
  { role: 'user', content: input },
];

try {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.6,
      max_tokens: 800,
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim();
  setChatLog((prev) => [...prev, `🤖 Bot: ${reply || 'No response'}`]);
} catch (err) {
  setChatLog((prev) => [...prev, `⚠️ Error: ${err}`]);
}

setInput('');
setLoading(false);
};

return (
<div className="mt-16 px-4">
<div className="max-w-3xl mx-auto rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-white">
<h2 className="text-3xl font-bold mb-4 text-center">
🤖 EduSign AI Recommender
</h2>
<p className="text-sm text-gray-300 mb-4 text-center">
Ask what to learn next! Based on your badge history, our AI will guide your learning journey.
</p>
    <div className="bg-white/5 border border-white/10 rounded-lg max-h-64 overflow-y-auto p-3 space-y-3 mb-5 text-sm transition-all">
      {chatLog.length === 0 ? (
        <p className="text-gray-400 text-center italic">No messages yet.</p>
      ) : (
        chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-lg w-fit max-w-full whitespace-pre-wrap ${
              msg.startsWith('🧑')
                ? 'bg-blue-600 self-end ml-auto'
                : msg.startsWith('🤖')
                ? 'bg-gray-700'
                : 'bg-red-500'
            }`}
          >
            {msg}
          </div>
        ))
      )}
    </div>

    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <input
        type="text"
        placeholder="Ask what to study next..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 px-4 py-2 rounded-md bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={sendQuery}
        disabled={loading}
        className={`px-5 py-2 font-semibold rounded-md bg-gradient-to-r from-blue-500 to-teal-500 text-white transition hover:scale-105 duration-200 ${
          loading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>
    </div>
  </div>
</div>
);
}
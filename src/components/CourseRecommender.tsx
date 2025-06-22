// src/components/CourseRecommender.tsx
import { useState } from 'react';
import type { NFT } from '../lib/LocalStorageUtils'; // Ensure path is correct
import { getNFTs } from '../lib/LocalStorageUtils';

export default function CourseRecommender() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_GROQ_API_URL;
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const existingBadges = getNFTs()
    .map((nft: NFT) => `- ${nft.name}: ${nft.description}`)
    .join('\n');

  const sendQuery = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setChatLog((prev) => [...prev, `🧑 You: ${input}`]);

    const messages = [
      {
        role: 'system',
        content: `You are an AI course advisor. The user has the following achievement badges:\n${existingBadges}.\n\nYour job is to recommend future courses the user should take based on their past achievements.`,
      },
      {
        role: 'user',
        content: input,
      },
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
    } catch (err: any) {
      setChatLog((prev) => [...prev, `⚠️ Error: ${err.message || err}`]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="mt-10 p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📚 EduSign AI Course Recommender</h2>
      <div className="min-h-[120px] max-h-64 overflow-y-auto bg-gray-100 rounded p-3 text-sm mb-4 whitespace-pre-wrap">
        {chatLog.map((msg, idx) => (
          <div key={idx} className="mb-2">{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask what course to take next..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendQuery}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>
    </div>
  );
}

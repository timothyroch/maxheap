'use client';

import { useState } from 'react';

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <pre className="rounded-2xl bg-gray-900 text-gray-50 p-5 overflow-auto text-sm font-mono shadow-lg">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-600"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type RecognitionEntry = {
  id: string;
  originalImage: string;
  recognizedText: string;
  confidenceScore: number;
  createdAt: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<RecognitionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        const { data } = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-8">Recognition History</h1>
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
        No recognition history found.
          </p>
          <div className="space-x-4">
        <Link
          href="/upload"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors"
        >
          Try Recognition
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors"
        >
          Reload
        </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Recognition History</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="aspect-video relative">
              <img
                src={entry.originalImage}
                alt={`Original image for ${entry.recognizedText}`}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Recognized Text</h3>
                <p className="text-2xl font-mono">{entry.recognizedText}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</h3>
                <p className="text-lg font-semibold">
                  {(entry.confidenceScore * 100).toFixed(2)}%
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Processed On</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
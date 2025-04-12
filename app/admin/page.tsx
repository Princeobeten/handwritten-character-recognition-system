'use client';

import { useState, useEffect } from 'react';

type Stats = {
  totalUploads: number;
  averageAccuracy: number;
  lastRetrainedAt: string;
  commonErrors: Array<{
    character: string;
    errorCount: number;
  }>;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      const response = await fetch('/api/admin/retrain', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Retraining failed');
      await fetchStats(); // Refresh stats after retraining
    } catch (error) {
      console.error('Error during retraining:', error);
    } finally {
      setIsRetraining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className={`
            px-4 py-2 rounded-md text-white font-semibold
            ${isRetraining
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500'}
          `}
        >
          {isRetraining ? 'Retraining...' : 'Retrain Model'}
        </button>
      </div>

      {stats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Uploads</h3>
            <p className="mt-2 text-3xl font-semibold">{stats.totalUploads}</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Accuracy</h3>
            <p className="mt-2 text-3xl font-semibold">
              {(stats.averageAccuracy * 100).toFixed(1)}%
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Retrained</h3>
            <p className="mt-2 text-lg font-semibold">
              {new Date(stats.lastRetrainedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Model Status</h3>
            <p className="mt-2 text-lg font-semibold text-green-600">Active</p>
          </div>
        </div>
      )}

      {stats?.commonErrors && stats.commonErrors.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Common Recognition Errors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Character
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.commonErrors.map((error, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {error.character}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {error.errorCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
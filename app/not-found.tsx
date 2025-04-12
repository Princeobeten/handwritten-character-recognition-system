import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
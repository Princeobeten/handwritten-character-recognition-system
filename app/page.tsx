import Link from 'next/link';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="relative isolate px-4 sm:px-6 flex justify-center items-center h-screen lg:px-8">
      <div className="mx-auto max-w-2xl py-16 sm:py-32 lg:py-48">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight lg:text-6xl">
            Handwritten Character Recognition System
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 px-2 sm:px-0">
            Upload an image of handwritten characters and let our advanced AI system recognize them.
            Using k-Nearest Neighbors algorithm and Histogram of Oriented Gradients for accurate recognition.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link
              href="/upload"
              className="w-full sm:w-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowUpTrayIcon className="h-5 w-5" />
                Upload Image
              </div>
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto text-center rounded-md py-2.5 md:py-2 md:px-4 text-sm font-semibold leading-6 border border-gray-200 text-gray-900 dark:text-gray-100"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

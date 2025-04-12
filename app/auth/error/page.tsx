'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errors: { [key: string]: string } = {
  Configuration: 'There was a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification link has expired or has already been used.',
  Default: 'An authentication error occurred.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error ? errors[error] || errors.Default : errors.Default;

  return (
    <div className="relative isolate px-4 sm:px-6 flex justify-center items-center h-screen lg:px-8">
      <div className="mx-auto max-w-2xl py-16 sm:py-32 lg:py-48">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-red-600 mb-4">Authentication Error</h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 dark:text-gray-300">{errorMessage}</p>
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
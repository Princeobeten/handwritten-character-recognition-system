'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black border-b shadow-sm border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-300 hover:text-gray-200">
              HCRS
            </Link>
          </div>
          
          {session?.user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-300 hover:text-gray-400"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}